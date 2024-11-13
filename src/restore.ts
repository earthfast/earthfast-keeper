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

import { EarthfastBilling, EarthfastNodes, EarthfastOperators, EarthfastProjects, EarthfastRegistry, EarthfastReservations, EarthfastTimelock, EarthfastToken } from "../types/localhost";
import { getContract, getProvider, Networks, stderr } from "./util";

// Converts a string like "0.0" to a BigNumber with 6 decimal places
const parseUSDC = (value: string): BigNumber => {
  // Parse the string to BigNumber with 6 decimal places (USDC standard)
  return parseUnits(value, 6);
};

// Converts a string like "0.0" to a BigNumber with 18 decimal places
const parseTokens = (value: string): BigNumber => {
  // Parse the string to BigNumber with 18 decimal places (EARTHFAST standard)
  return parseUnits(value, 18);
};

// deployed and minted by hand on sepolia
const USDC_SEPOLIA_ADDRESS = "0x0e9ad5c78b926f3368b1bcfc2dede9042c2d2a18";
const USDC_SEPOLIA_STAGING_ADDRESS = "0x152C5Ddd523890A49ba5b7E73eda0E6a3Bae7710";
const USDC_MAINNET_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

// TODO: fix object typing
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
  //   set the guardian address to be used as registry admin
  const guardianAddress = process.env.GUARDIAN_ADDRESS;

  // get the contracts
  const billing = await getContract<EarthfastBilling>(args.network, "EarthfastBilling", provider);
  const nodes = await getContract<EarthfastNodes>(args.network, "EarthfastNodes", provider);
  const operators = await getContract<EarthfastOperators>(args.network, "EarthfastOperators", provider);
  const projects = await getContract<EarthfastProjects>(args.network, "EarthfastProjects", provider);
  const registry = await getContract<EarthfastRegistry>(args.network, "EarthfastRegistry", provider);
  const reservations = await getContract<EarthfastReservations>(args.network, "EarthfastReservations", provider);
  const token = await getContract<EarthfastToken>(args.network, "EarthfastToken", provider);
  const timelock = await getContract<EarthfastTimelock>(args.network, "EarthfastTimelock", provider);
  const usdcAddress = args.network === "testnet-sepolia" ? USDC_SEPOLIA_ADDRESS : args.network === "testnet-sepolia-staging" ? USDC_SEPOLIA_STAGING_ADDRESS : args.network === "mainnet" ? USDC_MAINNET_ADDRESS : USDC_GOERLI_ADDRESS;

  // load the dump file
  const dump = JSON.parse(fs.readFileSync(args.file, "utf8"));

  // restore the projects
  const projectCount = dump.EarthfastProjects.projects.length;
  const projectData = dump.EarthfastProjects.projects.map((project: any) => ({
    id: project.id,
    owner: project.owner,
    name: project.name,
    email: project.email,
    escrow: parseUSDC(project.escrow),
    reserve: parseUSDC(project.reserve),
    content: project.content,
    checksum: project.checksum,
    metadata: project.metadata,
  }));
  const projectCreators = dump.EarthfastProjects.projectCreators;

  console.log("restoring projects...");
  await projects.connect(signer).unsafeImportData(projectData, projectCreators, true);

  // restore the operators
  const operatorCount = dump.EarthfastOperators.operators.length;
  const operatorData = dump.EarthfastOperators.operators.map((operator: any) => ({
    id: operator.id,
    owner: operator.owner,
    name: operator.name,
    email: operator.email,
    stake: parseTokens(operator.stake),
    balance: parseUSDC(operator.balance),
  }));

  console.log("restoring operators...");
  await operators.connect(signer).unsafeImportData(operatorData, true);

  // restore the nodes
  const nodeCount = dump.EarthfastNodes.nodes.length;
  const nodeData = dump.EarthfastNodes.nodes.map((node: any) => ({
    id: node.id,
    operatorId: node.operatorId,
    host: node.host,
    region: node.region,
    topology: node.topology,
    disabled: node.disabled,
    prices: node.prices.map(parseUSDC),
    projectIds: node.projectIds,
  }));
  const topologyCreators = dump.EarthfastNodes.topologyCreators;

  console.log("restoring nodes...");
  await nodes.connect(signer).unsafeImportData(nodeData, topologyCreators, true);

  //   restore the reservations
  console.log("restoring reservations...");
  await reservations.connect(signer).unsafeImportData(nodeData, true);

  //   initialize the registry to restore nonce and epoch information
  const registryAdmins = [guardianAddress, timelock.address];
  const registryInitializationArgs = [
    registryAdmins,
    {
        version: dump.EarthfastRegistry.version,
        nonce: dump.EarthfastRegistry.nonce,
        epochStart: dump.EarthfastRegistry.epochStart,
        lastEpochLength: dump.EarthfastRegistry.lastEpochLength,
        nextEpochLength: dump.EarthfastRegistry.nextEpochLength,
        gracePeriod: dump.EarthfastRegistry.gracePeriod ?? "86400", // 1 day
        usdc: usdcAddress,
        token: token.address,
        billing: billing.address,
        nodes: nodes.address,
        operators: operators.address,
        projects: projects.address,
        reservations: reservations.address,
      },
  ];
  console.log("initializing registry...");
  await registry.connect(signer).initialize(...registryInitializationArgs);

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
