// Downloads contract data from blockchain.
//
// USAGE
// $ npm run dump -- --network {mainnet|testnet|staging|localhost}

import fs from "fs";
import path from "path";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { AddressZero, HashZero } from "@ethersproject/constants";
import { JsonRpcProvider, Provider } from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";
import { Contract } from "ethers";
import parseArgs from "minimist";

import {
  ArmadaBilling,
  ArmadaNodes,
  ArmadaOperators,
  ArmadaProjects,
  ArmadaRegistry,
  ArmadaToken,
} from "./types/staging";

const Networks: Record<string, { rpcUrl: string; abiDir?: string }> = {
  mainnet: { rpcUrl: "https://rpc.ankr.com/eth" },
  testnet: { rpcUrl: "https://rpc.ankr.com/eth_goerli" },
  staging: { rpcUrl: "https://rpc.ankr.com/eth_goerli" },
  localhost: { rpcUrl: "http://localhost:8545", abiDir: "../armada-contracts/deployments/localhost" },
};

const formatUSDC = (value: BigNumberish): string => `${formatUnits(value, 6)} USDC`;
const formatTokens = (value: BigNumberish): string => `${formatUnits(value, 18)} ARMADA`;
const isUnique = <T>(value: T, index: number, self: T[]) => self.indexOf(value) === index;
async function hasRole(contract: Contract, role: string, address: string): Promise<boolean> {
  return await contract.hasRole(role, address);
}

async function getProvider(network: string): Promise<Provider> {
  const provider = new JsonRpcProvider(Networks[network].rpcUrl);
  const network_ = await provider.getNetwork();
  console.log(`Using ${network} (${network_.chainId}/${network_.name})`);
  return provider;
}

async function getContract<T extends Contract>(network: string, contract: string, provider: Provider): Promise<T> {
  const dir = Networks[network].abiDir ?? path.join("./abi", network);
  const file = path.join(dir, contract + ".json");
  const abi = JSON.parse(fs.readFileSync(file).toString());
  console.log(`Contract ${abi.address} (${contract})`);
  return new Contract(abi.address, abi.abi, provider) as T;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.network) {
    throw Error("Missing --network");
  }
  if (!Networks[args.network]) {
    throw Error("Invalid --network");
  }

  const provider = await getProvider(args.network);
  const block = await provider.getBlock("latest");
  const blockTag = block.hash;
  console.log(`Block ${block.number} (${blockTag})`);

  const token = await getContract<ArmadaToken>(args.network, "ArmadaToken", provider);
  const registry = await getContract<ArmadaRegistry>(args.network, "ArmadaRegistry", provider);
  const billing = await getContract<ArmadaBilling>(args.network, "ArmadaBilling", provider);
  const nodes = await getContract<ArmadaNodes>(args.network, "ArmadaNodes", provider);
  const operators = await getContract<ArmadaOperators>(args.network, "ArmadaOperators", provider);
  const projects = await getContract<ArmadaProjects>(args.network, "ArmadaProjects", provider);

  const topologyNodeCount = await nodes.getNodeCount(HashZero, true, {blockTag});
  const contentNodeCount = await nodes.getNodeCount(HashZero, false, {blockTag});
  const topologyNodeDataRaw = await nodes.getNodes(HashZero, true, 0, topologyNodeCount, {blockTag});
  const contentNodeDataRaw = await nodes.getNodes(HashZero, false, 0, contentNodeCount, {blockTag});
  const topologyNodeData = topologyNodeDataRaw.slice().sort((a, b) => a.id.localeCompare(b.id));
  const contentNodeData = contentNodeDataRaw.slice().sort((a, b) => a.id.localeCompare(b.id));
  const nodeData = topologyNodeData.concat(contentNodeData);

  const operatorCount = await operators.getOperatorCount({blockTag});
  const operatorDataRaw = await operators.getOperators(0, operatorCount, {blockTag});
  const operatorData = operatorDataRaw.slice().sort((a, b) => a.id.localeCompare(b.id));
  const operatorOwners = operatorData.map((v) => v.owner as string).filter(isUnique).sort();
  const topologyCreators: string[] = [];
  for (let i = 0; i < operatorOwners.length; ++i) {
    if (await hasRole(nodes, await nodes.TOPOLOGY_CREATOR_ROLE({blockTag}), operatorOwners[i])) {
      topologyCreators.push(operatorOwners[i]);
    }
  }

  const projectCount = await projects.getProjectCount({blockTag});
  const projectDataRaw = await projects.getProjects(0, projectCount, {blockTag});
  const projectData = projectDataRaw.slice().sort((a, b) => a.id.localeCompare(b.id));
  const projectOwners = projectData.map((v) => v.owner as string).concat(AddressZero).filter(isUnique).sort();
  const projectCreators: string[] = [];
  const projectCreatorRole = await projects.PROJECT_CREATOR_ROLE({blockTag});
  for (let i = 0; i < projectOwners.length; ++i) {
    if (await hasRole(projects, projectCreatorRole, projectOwners[i])) {
      projectCreators.push(projectOwners[i]);
    }
  }

  const knownAddresses = [registry.address].concat([...operatorOwners, ...projectOwners].sort()).filter(isUnique);
  const knownHolders = (
    await Promise.all(
      knownAddresses.map(async (address) => ({
        address: address === registry.address ? "ArmadaRegistry" : address,
        balance: await token.balanceOf(address, {blockTag}),
      }))
    )
  ).filter(({ balance }) => !balance.isZero());

  const totalBalance = knownHolders.reduce((sum, val) => ({ address: "", balance: sum.balance.add(val.balance) }));
  if (!totalBalance.balance.eq(await token.totalSupply({blockTag}))) {
    console.warn("WARNING: Could not identify all token holders");
  }

  const idCount = nodeData.length + operatorData.length + projectData.length;
  if (!(await registry.getNonce({blockTag})).gte(idCount)) {
    throw Error("Mismatched nonce");
  }

  if (!(await registry.getCuedEpochLength({blockTag})).eq(await registry.getNextEpochLength({blockTag}))) {
    throw Error("Mismatched cuedEpochStart");
  }

  const data = {
    ArmadaToken: {
      holders: knownHolders.map(({ address, balance }) => ({ address, balance: formatTokens(balance) })),
    },
    ArmadaRegistry: {
      version: await registry.getVersion({blockTag}),
      nonce: (await registry.getNonce({blockTag})).toString(),
      lastEpochLength: (await registry.getLastEpochLength({blockTag})).toString(),
      nextEpochLength: (await registry.getNextEpochLength({blockTag})).toString(),
      cuedEpochLength: (await registry.getCuedEpochLength({blockTag})).toString(),
      gracePeriod: (await registry.getGracePeriod({blockTag})).toString(),
    },
    ArmadaNodes: {
      // NOTE: This only restores roles of existing operators
      topologyCreators,
      nodes: nodeData.map((v) => ({
        id: v.id,
        operatorId: v.operatorId,
        host: v.host,
        region: v.region,
        topology: v.topology,
        disabled: v.disabled,
        prices: v.prices.map((v: BigNumber) => formatUSDC(v)),
        projectIds: v.projectIds,
      })),
    },
    ArmadaOperators: {
      stakePerNode: formatTokens(await operators.getStakePerNode({blockTag})),
      operators: operatorData.map((v) => ({
        id: v.id,
        owner: v.owner,
        name: v.name,
        email: v.email,
        stake: formatTokens(v.stake),
        balance: formatUSDC(v.balance),
      })),
    },
    ArmadaProjects: {
      // NOTE: This only restores roles of existing projects and the special zero address
      projectCreators,
      projects: projectData.map((v) => ({
        id: v.id,
        owner: v.owner,
        name: v.name,
        email: v.email,
        escrow: formatUSDC(v.escrow),
        reserve: formatUSDC(v.reserve),
        content: v.content,
        checksum: v.checksum,
      })),
    },
    ArmadaBilling: {
      billingNodeIndex: (await billing.getBillingNodeIndex({blockTag})).toString(),
      renewalNodeIndex: (await billing.getRenewalNodeIndex({blockTag})).toString(),
    },
  };

  const dir = path.dirname(process.argv[1]);
  const file = path.join(dir, args.network + ".json");
  const before = fs.readFileSync(file).toString();
  const after = JSON.stringify(data, null, 2);
  if (before === after) {
    console.log(`Unchanged ${file}`);
    return;
  }

  fs.writeFileSync(file, after);
  console.log(`Wrote ${file}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
