// Checks if the contract is in reconciling mode.
//
// USAGE
// $ npx ts-node ./src/checkReconcile.ts --network {localhost|testnet-sepolia|testnet-sepolia-staging}

import { BigNumber } from "@ethersproject/bignumber";
import parseArgs from "minimist";
import { ArmadaRegistry } from "../types/staging";
import { getContract, getProvider, Networks, stderr, stdout } from "./util";

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.network) throw Error("Missing --network");
  if (!Networks[args.network]) throw Error("Invalid --network");

  const provider = await getProvider(args.network);
  const block = await provider.getBlock("latest");
  stderr(`Block ${block.number} (${block.hash})`);

  const registry = await getContract<ArmadaRegistry>(args.network, "ArmadaRegistry", provider);

  try {
    const lastEpochStart = await registry.getLastEpochStart();
    const lastEpochLength = await registry.getLastEpochLength();
    const epochRemainder = await registry.getEpochRemainder();
    const currentTimestamp = BigNumber.from(Math.floor(Date.now() / 1000));
    const isReconciling = currentTimestamp.gte(lastEpochStart.add(lastEpochLength));
    const hasEpochRemainder = !epochRemainder.isZero();

    stdout(JSON.stringify({
      isReconciling,
      hasEpochRemainder,
      lastEpochStart: new Date(lastEpochStart.toNumber() * 1000).toISOString(),
      lastEpochLength: `${lastEpochLength.toString()} seconds`,
      currentTime: new Date(currentTimestamp.toNumber() * 1000).toISOString(),
      epochRemainder: `${epochRemainder.toString()} seconds`,
      isContractInReconcilingMode: isReconciling,
      epochEnd: new Date(lastEpochStart.add(lastEpochLength).toNumber() * 1000).toISOString()
    }, null, 2));
  } catch (error) {
    stderr(`Error checking reconciling status: ${error}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
