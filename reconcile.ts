// Reconciles all nodes on the network at 100% uptime.
//
// USAGE
// $ npx hardhat run reconcile.ts --network ...

import { HashZero } from "../armada-contracts/node_modules/@ethersproject/constants";
import hre from "../armada-contracts/node_modules/hardhat";
import { createProposal } from "../armada-contracts/lib/deploy";
import { attach, confirm, signers, stringify, wait } from "../armada-contracts/lib/util";
import "../armada-contracts/node_modules/hardhat-deploy";

// @ts-ignore Type created during hardhat compile
type ArmadaBilling = import("../armada-contracts/typechain-types").ArmadaBilling;
// @ts-ignore Type created during hardhat compile
type ArmadaNodes = import("../armada-contracts/typechain-types").ArmadaNodes;
// @ts-ignore Type created during hardhat compile
type ArmadaRegistry = import("../armada-contracts/typechain-types").ArmadaRegistry;

declare module "../armada-contracts/node_modules/hardhat/types/config" {
  export interface HardhatConfig {
    ask?: boolean;
  }
}

async function main() {
  if (!hre.network.tags.dev) {
    console.warn("WARNING: Should not use this script for production");
  }

  const { admin } = await signers(hre);
  const nodes = <ArmadaNodes>await attach(hre, "ArmadaNodes");
  const billing = <ArmadaBilling>await attach(hre, "ArmadaBilling");
  const registry = <ArmadaRegistry>await attach(hre, "ArmadaRegistry");

  const nodesData = await nodes.getNodes(HashZero, false, 0, await nodes.getNodeCount(HashZero, false));
  const nodeIds = nodesData.map((n) => n.id);
  const uptimeBips = nodesData.map(() => 10000);

  if (hre.network.tags.dev) {
    await wait(billing.connect(admin).processBilling(HashZero, nodeIds, uptimeBips));
    await wait(billing.connect(admin).processRenewal(HashZero, nodeIds));
    await wait(registry.connect(admin).advanceEpoch(HashZero));
  } else {
    hre.config.ask = true;

    const billingArgs = [HashZero, nodeIds, uptimeBips.map((n) => n.toString())];
    if (confirm(hre, `Execute ArmadaBilling.processBilling ${stringify(billingArgs)}`)) {
      await createProposal(hre, "ArmadaBilling", billing.address, admin.address, "processBilling", billingArgs);
    }
    const renewalArgs = [HashZero, nodeIds];
    if (confirm(hre, `Execute ArmadaBilling.processRenewal ${stringify(renewalArgs)}`)) {
      await createProposal(hre, "ArmadaBilling", billing.address, admin.address, "processRenewal", renewalArgs);
    }
    const advanceArgs = [HashZero];
    if (confirm(hre, `Execute ArmadaRegistry.advanceEpoch ${stringify(advanceArgs)}`)) {
      await createProposal(hre, "ArmadaRegistry", registry.address, admin.address, "advanceEpoch", advanceArgs);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
