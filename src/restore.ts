// Restores contract data from a dump file.
//
// USAGE
// $ npx ts-node ./src/restore.ts --network {localhost|testnet-sepolia|testnet-sepolia-staging} [--file PATH]
// $ npx ts-node ./src/restore.ts --network localhost --file ./data/localhost/dump.json

import fs from "fs";
import path from "path";
import { parseArgs } from "minimist";
import { getContract, getProvider, Networks, stderr } from "./util";

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
  const signer = new Wallet(process.env.PRIVATE_KEY!, provider);

  // load the dump file
  const provider = await getProvider(args.network);
  const billing = await getContract<EarthfastBilling>(args.network, "EarthfastBilling", provider);
  const nodes = await getContract<EarthfastNodes>(args.network, "EarthfastNodes", provider);
  const operators = await getContract<EarthfastOperators>(args.network, "EarthfastOperators", provider);
  const projects = await getContract<EarthfastProjects>(args.network, "EarthfastProjects", provider);
  const registry = await getContract<EarthfastRegistry>(args.network, "EarthfastRegistry", provider);
  const dump = JSON.parse(fs.readFileSync(args.file, "utf8"));

  // restore the projects
  const projectCount = dump.projects.length;
  const projectData = dump.projects.map((project) => ({
    id: project.id,
    owner: project.owner,
    name: project.name,
    email: project.email,
    escrow: project.escrow,
    reserve: project.reserve,
    content: project.content,
    checksum: project.checksum,
    metadata: project.metadata,
  }));
  const projectCreators = dump.projectCreators;
  await projects.connect(signer).unsafeImportData(projectData, projectCreators, true);

  // restore the operators
  const operatorCount = dump.operators.length;
  const operatorData = dump.operators.map((operator) => ({
    id: operator.id,
    owner: operator.owner,
    name: operator.name,
    email: operator.email,
    stake: operator.stake,
  }));
  await operators.connect(signer).unsafeImportData(operatorData, true);

  // restore the nodes
  const nodeCount = dump.nodes.length;
  const nodeData = dump.nodes.map((node) => ({
    id: node.id,
    operatorId: node.operatorId,
    host: node.host,
    region: node.region,
    topology: node.topology,
    disabled: node.disabled,
    prices: node.prices,
    projectIds: node.projectIds,
  }));
  const topologyCreators = dump.topologyCreators;
  await nodes.connect(signer).unsafeImportData(nodeData, topologyCreators, true);

  // verify the data import was succesful
  const newProjectCount = await projects.getProjectCount();
  const newOperatorCount = await operators.getOperatorCount();
  const newNodeCount = await nodes.getNodeCount();
  if (newProjectCount !== projectCount) throw Error("Failed to restore projects");
  if (newOperatorCount !== operatorCount) throw Error("Failed to restore operators");
  if (newNodeCount !== nodeCount) throw Error("Failed to restore nodes");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
