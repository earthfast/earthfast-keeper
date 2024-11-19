const { ethers } = require("ethers");
const {
  DefenderRelayProvider,
  DefenderRelaySigner,
} = require("defender-relay-client/lib/ethers");

const HashZero = "0x0000000000000000000000000000000000000000000000000000000000000000";
const stringify = (value) => JSON.stringify(value, null, 2);

exports.handler = async function (credentials, configPath) {
  // Load the appropriate config based on the environment
  const config = require(configPath);
  console.log(`Running reconcile for network: ${config.network}`);

  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider);

  const registry = new ethers.Contract(config.addresses.registry, config.abis.registry, signer);
  const nodes = new ethers.Contract(config.addresses.nodes, config.abis.nodes, signer);
  const billing = new ethers.Contract(config.addresses.billing, config.abis.billing, signer);

  const nodeCount = await nodes.getNodeCount(HashZero);
  const nodeData = await nodes.getNodes(HashZero, 0, nodeCount);
  const nodeIds = nodeData.map((n) => n.id);
  const uptimeBips = nodeData.map(() => 10000);

  try {
    const billingArgs = [[...nodeIds], [...uptimeBips]];
    console.log(`Execute EarthfastBilling.processBilling ${stringify(billingArgs)}`);
    const billingTx = await billing.processBilling(...billingArgs);
    console.log(billingTx.hash);
    await billingTx.wait();
  } catch (e) {
    console.error("Error processing EarthfastBilling.processBilling", e);
  }

  try {
    const renewalArgs = [[...nodeIds]];
    console.log(`Execute EarthfastBilling.processRenewal ${stringify(renewalArgs)}`);
    const renewalTx = await billing.processRenewal(...renewalArgs);
    console.log(renewalTx.hash);
    await renewalTx.wait();
  } catch (e) {
    console.error("Error processing EarthfastBilling.processRenewal", e);
  }

  try {
    const advanceArgs = [];
    console.log(`Execute EarthfastRegistry.advanceEpoch ${stringify(advanceArgs)}`);
    const advanceTx = await registry.advanceEpoch(...advanceArgs);
    console.log(advanceTx.hash);
    await advanceTx.wait();
  } catch (e) {
    console.error("Error processing EarthfastRegistry.advanceEpoch", e);
  }
};

// Only when running locally
if (require.main === module) {
  require("dotenv").config();
  const { RELAYER_API_KEY: apiKey, RELAYER_API_SECRET: apiSecret } = process.env;
  const network = process.env.NETWORK || 'testnet-sepolia';
  const configPath = `./config/${network}.js`;
  
  exports
    .handler({ apiKey, apiSecret }, configPath)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
