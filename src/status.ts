// Shows current epoch state.
//
// USAGE
// $ npx ts-node ./src/status.ts --network {localhost|staging|testnet|mainnet}

import { HashZero } from "@ethersproject/constants";
import { Block } from "@ethersproject/providers";
import { Contract } from "ethers";
import parseArgs from "minimist";
import { ArmadaBilling, ArmadaNodes, ArmadaRegistry } from "../types/staging";
import { TypedEvent, TypedEventFilter } from "../types/staging/common";
import { getContract, getProvider, Networks, stderr, stdout } from "./util";

async function findEvent<C extends Contract, E extends TypedEvent>(contract: C, filter: TypedEventFilter<E>, block: Block): Promise<E> {
  const BATCH = 3000;
  for (let n = block.number; ; n -= BATCH) {
    const [from, to] = [n - BATCH, n];
    stderr(`Scanning blocks ${from}..${to}`);
    const events = await contract.queryFilter(filter, from, to);
    if (events.length) {
      return events[0] as E;
    }
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.network) throw Error("Missing --network");
  if (!Networks[args.network]) throw Error("Invalid --network");

  const provider = await getProvider(args.network);
  const block = await provider.getBlock("latest");
  stderr(`Block ${block.number} (${block.hash})`);

  const registry = await getContract<ArmadaRegistry>(args.network, "ArmadaRegistry", provider);
  const billing = await getContract<ArmadaBilling>(args.network, "ArmadaBilling", provider);
  const nodes = await getContract<ArmadaNodes>(args.network, "ArmadaNodes", provider);

  const epochAdvancedEvent = await findEvent(registry, registry.filters.EpochAdvanced(), block);
  const epochAdvancedBlock = await provider.getBlock(epochAdvancedEvent.blockNumber);
  const nodeArray = await nodes.getNodes(HashZero, false, 0, 1, { blockTag: epochAdvancedBlock.hash });
  const nodeId = nodeArray[0].id;
  const epochFinishedEvent = await findEvent(billing, billing.filters.ReservationResolved(nodeId), epochAdvancedBlock);
  stdout(JSON.stringify({
    epochFinishedBlock: epochFinishedEvent.blockNumber,
    epochAdvancedBlock: epochAdvancedEvent.blockNumber,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
