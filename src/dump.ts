// Downloads contract data from blockchain.
//
// USAGE
// $ npx ts-node ./src/dump.ts --network {localhost|testnet-sepolia|testnet-sepolia-staging} [--block TAG]

import fs from "fs";
import path from "path";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { AddressZero, HashZero } from "@ethersproject/constants";
import { formatUnits } from "@ethersproject/units";
import { Contract } from "ethers";
import parseArgs from "minimist";
import { EarthfastBilling, EarthfastNodes, EarthfastOperators, EarthfastProjects, EarthfastRegistry, EarthfastToken } from "../types/testnet-sepolia";
import { getContract, getProvider, Networks, stderr } from "./util";

const formatUSDC = (value: BigNumberish): string => `${formatUnits(value, 6)}`;
const formatTokens = (value: BigNumberish): string => `${formatUnits(value, 18)}`;
const isUnique = <T>(value: T, index: number, self: T[]) => self.indexOf(value) === index;
async function hasRole(contract: Contract, role: string, address: string): Promise<boolean> {
  return await contract.hasRole(role, address);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.network) throw Error("Missing --network");
  if (!Networks[args.network]) throw Error("Invalid --network");
  if (!args.block) args.block = "latest";

  const provider = await getProvider(args.network);
  const block = await provider.getBlock(args.block);
  const blockTag = block.hash;
  stderr(`Block ${block.number} (${blockTag})`);

  const token = await getContract<EarthfastToken>(args.network, "EarthfastToken", provider);
  const registry = await getContract<EarthfastRegistry>(args.network, "EarthfastRegistry", provider);
  const billing = await getContract<EarthfastBilling>(args.network, "EarthfastBilling", provider);
  const nodes = await getContract<EarthfastNodes>(args.network, "EarthfastNodes", provider);
  const operators = await getContract<EarthfastOperators>(args.network, "EarthfastOperators", provider);
  const projects = await getContract<EarthfastProjects>(args.network, "EarthfastProjects", provider);

  const topologyNodeCount = await nodes.getNodeCount(HashZero, true, { blockTag });
  const contentNodeCount = await nodes.getNodeCount(HashZero, false, { blockTag });
  const topologyNodeData = await nodes.getNodes(HashZero, true, 0, topologyNodeCount, { blockTag });
  const contentNodeData = await nodes.getNodes(HashZero, false, 0, contentNodeCount, { blockTag });
  const topologyNodeArray = topologyNodeData.slice().sort((a, b) => a.id.localeCompare(b.id));
  const contentNodeArray = contentNodeData.slice().sort((a, b) => a.id.localeCompare(b.id));
  const nodeArray = topologyNodeArray.concat(contentNodeArray);

  const operatorCount = await operators.getOperatorCount({ blockTag });
  const operatorData = await operators.getOperators(0, operatorCount, { blockTag });
  const operatorArray = operatorData.slice().sort((a, b) => a.id.localeCompare(b.id));
  const operatorOwners = operatorArray.map((v) => v.owner as string).filter(isUnique).sort();
  const topologyCreators: string[] = [];
  for (let i = 0; i < operatorOwners.length; ++i) {
    if (await hasRole(nodes, await nodes.TOPOLOGY_CREATOR_ROLE({ blockTag }), operatorOwners[i])) {
      topologyCreators.push(operatorOwners[i]);
    }
  }

  const projectCount = await projects.getProjectCount({ blockTag });
  const projectData = await projects.getProjects(0, projectCount, { blockTag });
  const projectArray = projectData.slice().sort((a, b) => a.id.localeCompare(b.id));
  const projectOwners = projectArray.map((v) => v.owner as string).concat(AddressZero).filter(isUnique).sort();
  const projectCreators: string[] = [];
  const projectCreatorRole = await projects.PROJECT_CREATOR_ROLE({ blockTag });
  for (let i = 0; i < projectOwners.length; ++i) {
    if (await hasRole(projects, projectCreatorRole, projectOwners[i])) {
      projectCreators.push(projectOwners[i]);
    }
  }

  const knownAddresses = [registry.address].concat([...operatorOwners, ...projectOwners].sort()).filter(isUnique);
  const knownHolders = (
    await Promise.all(
      knownAddresses.map(async (address) => ({
        address: address === registry.address ? "EarthfastRegistry" : address,
        balance: await token.balanceOf(address, { blockTag }),
      }))
    )
  ).filter(({ balance }) => !balance.isZero());

  const totalBalance = knownHolders.reduce((sum, val) => ({ address: "", balance: sum.balance.add(val.balance) }));
  if (!totalBalance.balance.eq(await token.totalSupply({ blockTag }))) {
    stderr("WARNING: Could not identify all token holders");
  }

  const idCount = nodeArray.length + operatorArray.length + projectArray.length;
  if (!(await registry.getNonce({ blockTag })).gte(idCount)) {
    throw Error("Mismatched nonce");
  }

  if (!(await registry.getCuedEpochLength({ blockTag })).eq(await registry.getNextEpochLength({ blockTag }))) {
    throw Error("Mismatched cuedEpochStart");
  }

  const data = {
    EarthfastToken: {
      holders: knownHolders.map(({ address, balance }) => ({ address, balance: formatTokens(balance) })),
    },
    EarthfastRegistry: {
      version: await registry.getVersion({ blockTag }),
      nonce: (await registry.getNonce({ blockTag })).toString(),
      lastEpochLength: (await registry.getLastEpochLength({ blockTag })).toString(),
      nextEpochLength: (await registry.getNextEpochLength({ blockTag })).toString(),
      cuedEpochLength: (await registry.getCuedEpochLength({ blockTag })).toString(),
      gracePeriod: (await registry.getGracePeriod({ blockTag })).toString(),
    },
    EarthfastNodes: {
      // NOTE: This only restores roles of existing operators
      topologyCreators,
      nodes: nodeArray.map((v) => ({
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
    EarthfastOperators: {
      stakePerNode: formatTokens(await operators.getStakePerNode({ blockTag })),
      operators: operatorArray.map((v) => ({
        id: v.id,
        owner: v.owner,
        name: v.name,
        email: v.email,
        stake: formatTokens(v.stake),
        balance: formatUSDC(v.balance),
      })),
    },
    EarthfastProjects: {
      // NOTE: This only restores roles of existing projects and the special zero address
      projectCreators,
      projects: projectArray.map((v) => ({
        id: v.id,
        owner: v.owner,
        name: v.name,
        email: v.email,
        escrow: formatUSDC(v.escrow),
        reserve: formatUSDC(v.reserve),
        content: v.content,
        checksum: v.checksum,
        metadata: v.metadata,
      })),
    },
    EarthfastBilling: {
      billingNodeIndex: (await billing.getBillingNodeIndex({ blockTag })).toString(),
      renewalNodeIndex: (await billing.getRenewalNodeIndex({ blockTag })).toString(),
    },
  };

  const root = path.dirname(process.argv[1]);
  const dir = path.join(root, "../data");
  const file = path.join(dir, args.network + ".json");
  const before = fs.readFileSync(file).toString();
  const after = JSON.stringify(data, null, 2);
  if (before === after) {
    stderr(`Unchanged ${file}`);
    return;
  }

  fs.writeFileSync(file, after);
  stderr(`Wrote ${file}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
