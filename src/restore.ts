// Restores contract data from a dump file.
//
// USAGE
// $ npx ts-node ./src/restore.ts --network {localhost|testnet-sepolia|testnet-sepolia-staging} [--file PATH]
// $ npx ts-node ./src/restore.ts --network localhost --file ./data/staging.json

import fs from "fs";
import path from "path";
import parseArgs from "minimist";
import dotenv from 'dotenv';
import { BigNumber, Wallet } from "ethers";
import { parseUnits } from "ethers/lib/utils";

dotenv.config();

import { EarthfastBilling, EarthfastNodes, EarthfastOperators, EarthfastProjects, EarthfastRegistry, EarthfastToken } from "../types/localhost";
import { getContract, getProvider, Networks, stderr } from "./util";

// Converts a string like "0.0 USDC" to a BigNumber with 6 decimal places
const formatUSDC = (value: string): BigNumber => {
  // Remove "USDC" and trim any whitespace
  const numericValue = value.replace("USDC", "").trim();
  // Parse the string to BigNumber with 6 decimal places (USDC standard)
  return parseUnits(numericValue, 6);
};

const formatTokens = (value: string): BigNumber => {
  // Remove "ARMADA" and trim any whitespace
  const numericValue = value.replace("ARMADA", "").trim();
  // Parse the string to BigNumber with 18 decimal places (ARMADA standard)
  return parseUnits(numericValue, 18);
};

// TODO: fix object typing
// TODO: update the dump file to use the new contract names
// TODO: add stakePerNode to the restoration
// FIXME: currently failing due to lacking importer role: 0x9dd0c3bd9bb5e1c820c362d05d5cb38480246edb10ff416751bc3dcaccab86fe

// @dev: This script restores the contract data from a dump file created with the dump.ts script.
// @dev: It is assumed the new contracts were initalized with grantImporterRole == true, and that the signer has the IMPORT_ROLE granted on initialization.
// NOTE: This script does not restore the billing data (billingNodeIndex, renewalNodeIndex) or the epoch data.
async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.network) throw Error("Missing --network");
  if (!Networks[args.network]) throw Error("Invalid --network");
  if (!args.file) throw Error("Missing --file");

  // get the signer to execute the restoration transactions
  const provider = await getProvider(args.network);
  const signer = new Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);

  // get the contracts
  const billing = await getContract<EarthfastBilling>(args.network, "EarthfastBilling", provider);
  const nodes = await getContract<EarthfastNodes>(args.network, "EarthfastNodes", provider);
  const operators = await getContract<EarthfastOperators>(args.network, "EarthfastOperators", provider);
  const projects = await getContract<EarthfastProjects>(args.network, "EarthfastProjects", provider);
  const registry = await getContract<EarthfastRegistry>(args.network, "EarthfastRegistry", provider);

  // load the dump file
  const dump = JSON.parse(fs.readFileSync(args.file, "utf8"));

  // restore the projects
  const projectCount = dump.ArmadaProjects.projects.length;
  const projectData = dump.ArmadaProjects.projects.map((project: any) => ({
    id: project.id,
    owner: project.owner,
    name: project.name,
    email: project.email,
    escrow: formatUSDC(project.escrow),
    reserve: formatUSDC(project.reserve),
    content: project.content,
    checksum: project.checksum,
    metadata: project.metadata,
  }));
  const projectCreators = dump.ArmadaProjects.projectCreators;

  console.log("restoring projects...");
  await projects.connect(signer).unsafeImportData(projectData, projectCreators, true);

  // restore the operators
  const operatorCount = dump.ArmadaOperators.operators.length;
  const operatorData = dump.ArmadaOperators.operators.map((operator: any) => ({
    id: operator.id,
    owner: operator.owner,
    name: operator.name,
    email: operator.email,
    stake: formatTokens(operator.stake),
    balance: formatUSDC(operator.balance),
  }));

  console.log("restoring operators...");
  await operators.connect(signer).unsafeImportData(operatorData, true);

  // restore the nodes
  const nodeCount = dump.ArmadaNodes.nodes.length;
  const nodeData = dump.ArmadaNodes.nodes.map((node: any) => ({
    id: node.id,
    operatorId: node.operatorId,
    host: node.host,
    region: node.region,
    topology: node.topology,
    disabled: node.disabled,
    prices: node.prices.map(formatUSDC),
    projectIds: node.projectIds,
  }));
  const topologyCreators = dump.ArmadaNodes.topologyCreators;

  console.log("restoring nodes...");
  await nodes.connect(signer).unsafeImportData(nodeData, topologyCreators, true);

  // verify the data import was succesful
  const newProjectCount = await projects.getProjectCount();
  const newOperatorCount = await operators.getOperatorCount();

  console.log("newProjectCount:", newProjectCount.toString());
  console.log("newOperatorCount:", newOperatorCount.toString());

  //   const newNodeCount = await nodes.getNodeCount();
  if (newProjectCount !== projectCount) throw Error("Failed to restore projects");
  if (newOperatorCount !== operatorCount) throw Error("Failed to restore operators");
//   if (newNodeCount !== nodeCount) throw Error("Failed to restore nodes");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
