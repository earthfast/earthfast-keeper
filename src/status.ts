// Shows current epoch state.
//
// USAGE
// $ npx ts-node ./src/status.ts --network {localhost|staging|testnet|mainnet}

import { Block } from "@ethersproject/providers";
import { Contract } from "ethers";
import parseArgs from "minimist";
import { ArmadaBilling, ArmadaRegistry } from "../types/staging";
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

  // This assumes that the EpochAdvanced event happened not too long ago before this script was run.
  const epochAdvancedEvent_ = await findEvent(registry, registry.filters.EpochAdvanced(), block);
  const epochAdvancedEvent = { blockNumber: epochAdvancedEvent_.blockNumber, blockHash: epochAdvancedEvent_.blockHash };
  stderr(`Found EpochAdvanced event at block ${epochAdvancedEvent.blockNumber}`);

  // Work around for an apparent bug in ethers that badly serializes blockTags with leading zeros.
  while (epochAdvancedEvent.blockHash.startsWith("0x0")) {
    epochAdvancedEvent.blockNumber++;
    epochAdvancedEvent.blockHash = (await provider.getBlock(epochAdvancedEvent.blockNumber)).hash;
    stderr(`Block hash has leading zeros, use prev block ${epochAdvancedEvent.blockNumber}`);
  }

  const epochAdvancedBlock = await provider.getBlock(epochAdvancedEvent.blockNumber);

  // This assumes that there was only one EpochFinished event, that is all nodes fit in one block.
  const epochFinishedEvent_ = await findEvent(billing, billing.filters.ReservationResolved(), epochAdvancedBlock);
  const epochFinishedEvent = { blockNumber: epochFinishedEvent_.blockNumber, blockHash: epochFinishedEvent_.blockHash };
  
  // Use the block right before the (first) ReservationResolved event.
  epochFinishedEvent.blockNumber = epochFinishedEvent.blockNumber - 1;
  epochFinishedEvent.blockHash = (await provider.getBlock(epochFinishedEvent.blockNumber)).hash;
  stderr(`Found ReservationResolved event right after block ${epochFinishedEvent.blockNumber}`);

  // Work around for an apparent bug in ethers that badly serializes blockTags with leading zeros.
  while (epochFinishedEvent.blockHash.startsWith("0x0")) {
    epochFinishedEvent.blockNumber--;
    epochFinishedEvent.blockHash = (await provider.getBlock(epochFinishedEvent.blockNumber)).hash;
    stderr(`Block hash has leading zeros, use prev block ${epochFinishedEvent.blockNumber}`);
  }

  stdout(JSON.stringify({
    epochFinishedBlock: epochFinishedEvent.blockNumber,
    epochAdvancedBlock: epochAdvancedEvent.blockNumber,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
