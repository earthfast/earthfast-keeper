// Downloads contract data from blockchain.
//
// USAGE
// $ cd armada-contracts
// $ npx hardhat run dump.ts --network ...

import { promises as fs } from "fs";
import * as path from "path";
import hre from "../armada-contracts/node_modules/hardhat";
import { AddressZero, HashZero } from "../armada-contracts/node_modules/@ethersproject/constants";
import { BigNumber, Contract } from "../armada-contracts/node_modules/ethers";
import { attach, formatTokens, signers, stringify } from "../armada-contracts/lib/util";

// @ts-ignore Type created during hardhat compile
type ArmadaBilling = import("../armada-contracts/typechain-types").ArmadaBilling;
// @ts-ignore Type created during hardhat compile
type ArmadaNodes = import("../armada-contractstypechain-types").ArmadaNodes;
// @ts-ignore Type created during hardhat compile
type ArmadaNode = import("../armada-contracts/typechain-types/contracts/ArmadaNodes").ArmadaNodeStructOutput;
// @ts-ignore Type created during hardhat compile
type ArmadaOperators = import("../armada-contracts/typechain-types").ArmadaOperators;
// @ts-ignore Type created during hardhat compile
type ArmadaOperator = import("../armada-contracts/typechain-types/contracts/ArmadaOperators").ArmadaOperatorStructOutput;
// @ts-ignore Type created during hardhat compile
type ArmadaProjects = import("../armada-contracts/typechain-types").ArmadaProjects;
// @ts-ignore Type created during hardhat compile
type ArmadaProject = import("../armada-contracts/typechain-types/contracts/ArmadaProjects").ArmadaProjectStructOutput;
// @ts-ignore Type created during hardhat compile
type ArmadaRegistry = import("../armada-contracts/typechain-types").ArmadaRegistry;
// @ts-ignore Type created during hardhat compile
type ArmadaReservations = import("../armada-contracts/typechain-types").ArmadaReservations;
// @ts-ignore Type created during hardhat compile
type ArmadaToken = import("../armada-contracts/typechain-types").ArmadaToken;

const isUnique = (value: any, index: any, self: any) => self.indexOf(value) === index;

async function hasRole(contract: Contract, role: string, address: string): Promise<boolean> {
  return await contract.hasRole(role, address);
}

async function main() {
  if (hre.network.name === "hardhat") {
    throw Error("Must specify --network");
  }
  const { admin } = await signers(hre);
  const token = <ArmadaToken>await attach(hre, "ArmadaToken");
  const registry = <ArmadaRegistry>await attach(hre, "ArmadaRegistry");
  const billing = <ArmadaBilling>await attach(hre, "ArmadaBilling");
  const nodes = <ArmadaNodes>await attach(hre, "ArmadaNodes");
  const operators = <ArmadaOperators>await attach(hre, "ArmadaOperators");
  const projects = <ArmadaProjects>await attach(hre, "ArmadaProjects");
  const reservations = <ArmadaReservations>await attach(hre, "ArmadaReservations");
  if (!hre.network.tags.dev) {
    if (
      !(await registry.paused()) ||
      !(await billing.paused()) ||
      !(await nodes.paused()) ||
      !(await operators.paused()) ||
      !(await projects.paused()) ||
      !(await reservations.paused())
    ) {
      console.warn("WARNING: Contracts should be paused during data dump");
    }
  }

  const topologyNodesDataRaw = await nodes.getNodes(HashZero, true, 0, await nodes.getNodeCount(HashZero, true));
  const contentNodesDataRaw = await nodes.getNodes(HashZero, false, 0, await nodes.getNodeCount(HashZero, false));
  const topologyNodesData = (<ArmadaNode[]>topologyNodesDataRaw).slice().sort((a, b) => a.id.localeCompare(b.id));
  const contentNodesData = (<ArmadaNode[]>contentNodesDataRaw).slice().sort((a, b) => a.id.localeCompare(b.id));
  const nodesData = (<ArmadaNode[]>topologyNodesData).concat(contentNodesData);

  const operatorsDataRaw = await operators.getOperators(0, await operators.getOperatorCount());
  const operatorsData = (<ArmadaOperator[]>operatorsDataRaw).slice().sort((a, b) => a.id.localeCompare(b.id));
  const operatorOwners = operatorsData
    .map((v) => v.owner as string)
    .concat(admin.address)
    .filter(isUnique)
    .sort();
  const topologyCreators: string[] = [];
  for (let i = 0; i < operatorOwners.length; ++i) {
    if (await hasRole(nodes, await nodes.TOPOLOGY_CREATOR_ROLE(), operatorOwners[i])) {
      topologyCreators.push(operatorOwners[i]);
    }
  }

  const projectsDataRaw = await projects.getProjects(0, await projects.getProjectCount());
  const projectsData = (<ArmadaProject[]>projectsDataRaw).slice().sort((a, b) => a.id.localeCompare(b.id));
  const projectOwners = projectsData
    .map((v) => v.owner as string)
    .concat(AddressZero, admin.address)
    .filter(isUnique)
    .sort();
  const projectCreators: string[] = [];
  for (let i = 0; i < projectOwners.length; ++i) {
    if (await hasRole(projects, await projects.PROJECT_CREATOR_ROLE(), projectOwners[i])) {
      projectCreators.push(projectOwners[i]);
    }
  }

  const knownAddresses = [registry.address].concat([...operatorOwners, ...projectOwners].sort()).filter(isUnique);
  const knownHolders = (
    await Promise.all(
      knownAddresses.map(async (address) => ({
        address: address === registry.address ? "ArmadaRegistry" : address,
        balance: await token.balanceOf(address),
      }))
    )
  ).filter(({ balance }) => !balance.isZero());

  const totalBalance = knownHolders.reduce((sum, val) => ({ address: "", balance: sum.balance.add(val.balance) }));
  if (!totalBalance.balance.eq(await token.totalSupply())) {
    console.warn("WARNING: Could not identify all token holders");
  }

  const idCount = nodesData.length + operatorsData.length + projectsData.length;
  if (!(await registry.getNonce()).gte(idCount)) {
    throw Error("Mismatched nonce");
  }

  if (!(await registry.getCuedEpochLength()).eq(await registry.getNextEpochLength())) {
    throw Error("Mismatched cuedEpochStart");
  }

  const data = {
    ArmadaToken: {
      holders: knownHolders.map(({ address, balance }) => ({ address, balance: formatTokens(balance) })),
    },
    ArmadaRegistry: {
      version: await registry.getVersion(),
      nonce: (await registry.getNonce()).toString(),
      lastEpochLength: (await registry.getLastEpochLength()).toString(),
      nextEpochLength: (await registry.getNextEpochLength()).toString(),
      cuedEpochLength: (await registry.getCuedEpochLength()).toString(),
      gracePeriod: (await registry.getGracePeriod()).toString(),
      epochSlot: (await registry.lastEpochSlot()).toString(),
    },
    ArmadaNodes: {
      // NOTE: This only restores roles of existing operators
      topologyCreators,
      nodes: nodesData.map((v) => ({
        id: v.id,
        operatorId: v.operatorId,
        host: v.host,
        region: v.region,
        topology: v.topology,
        disabled: v.disabled,
        prices: v.prices.map((v: BigNumber) => formatTokens(v)),
        projectIds: v.projectIds,
      })),
    },
    ArmadaOperators: {
      stakePerNode: formatTokens(await operators.getStakePerNode()),
      operators: operatorsData.map((v) => ({
        id: v.id,
        owner: v.owner,
        name: v.name,
        email: v.email,
        stake: formatTokens(v.stake),
      })),
    },
    ArmadaProjects: {
      // NOTE: This only restores roles of existing projects and the special zero address
      projectCreators,
      projects: projectsData.map((v) => ({
        id: v.id,
        owner: v.owner,
        name: v.name,
        email: v.email,
        escrow: formatTokens(v.escrow),
        reserve: formatTokens(v.reserve),
        content: v.content,
        checksum: v.checksum,
      })),
    },
    ArmadaBilling: {
      billingNodeIndex: (await billing.getBillingNodeIndex()).toString(),
      renewalNodeIndex: (await billing.getRenewalNodeIndex()).toString(),
    },
  };

  const dir = path.dirname(process.argv[1]);
  const name = hre.network.name === "hardhat" ? "localhost" : hre.network.name;
  const file = process.env.DATA ?? path.join(dir, name + ".json");
  await fs.writeFile(file, stringify(data));
  console.log(`Saved ${file}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
