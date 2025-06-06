import fs from "fs";
import path from "path";
import { JsonRpcProvider, Provider } from "@ethersproject/providers";
import { Contract } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const RPC_URL = process.env.RPC_URL;

if (!RPC_URL) {
  throw new Error("RPC_URL is not set");
}

export const stdout = (s: string): void => console.log(s);
export const stderr = (s: string): void => console.warn("> " + s);

export const Networks: Record<string, { rpcUrl: string; abiDir?: string }> = {
  mainnet: { rpcUrl: "https://rpc.ankr.com/eth" },
  "testnet-sepolia": { rpcUrl: RPC_URL },
  "testnet-sepolia-staging": { rpcUrl: RPC_URL },
  localhost: { rpcUrl: "http://localhost:8545", abiDir: "../earthfast-contracts/deployments/localhost" },
};

export async function getProvider(network: string): Promise<Provider> {
  const provider = new JsonRpcProvider(Networks[network].rpcUrl);
  const network_ = await provider.getNetwork();
  stderr(`Using ${network} (${network_.chainId}/${network_.name})`);
  return provider;
}

export async function getContract<T extends Contract>(network: string, contract: string, provider: Provider): Promise<T> {
  const dir = Networks[network].abiDir ?? path.join("./abi", network);
  const file = path.join(dir, contract + ".json");
  const abi = JSON.parse(fs.readFileSync(file).toString());
  stderr(`Contract ${abi.address} (${contract})`);
  return new Contract(abi.address, abi.abi, provider) as T;
}
