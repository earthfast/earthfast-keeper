const REGISTRY_ADDRESS = "0xA73F1bd17a7F60374A6d4c511fBaebfDb3Bf774a";
const NODES_ADDRESS = "0x56247F96bb7DaC09F6120E8Ad084a20aBA00B477";
const BILLING_ADDRESS = "0x6Ecf1465065BbC2dA97F0AB845ff651f6de3dCBF";

const REGISTRY_ABI = [
  {
    inputs: [],
    name: "advanceEpoch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const NODES_ABI = [
  {
    inputs: [
      { internalType: "bytes32", name: "operatorIdOrZero", type: "bytes32" },
    ],
    name: "getNodeCount",
    outputs: [{ internalType: "uint256", name: "count", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "operatorIdOrZero", type: "bytes32" },
      { internalType: "uint256", name: "skip", type: "uint256" },
      { internalType: "uint256", name: "size", type: "uint256" },
    ],
    name: "getNodes",
    outputs: [
      {
        components: [
          { internalType: "bytes32", name: "id", type: "bytes32" },
          { internalType: "bytes32", name: "operatorId", type: "bytes32" },
          { internalType: "string", name: "host", type: "string" },
          { internalType: "string", name: "region", type: "string" },
          { internalType: "bool", name: "disabled", type: "bool" },
          { internalType: "uint256[2]", name: "prices", type: "uint256[2]" },
          {
            internalType: "bytes32[2]",
            name: "projectIds",
            type: "bytes32[2]",
          },
        ],
        internalType: "struct EarthfastNode[]",
        name: "values",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const BILLING_ABI = [
  {
    inputs: [
      { internalType: "bytes32[]", name: "nodeIds", type: "bytes32[]" },
      { internalType: "uint256[]", name: "uptimeBips", type: "uint256[]" },
    ],
    name: "processBilling",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32[]", name: "nodeIds", type: "bytes32[]" },
    ],
    name: "processRenewal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const { ethers } = require("ethers");
const {
  DefenderRelayProvider,
  DefenderRelaySigner,
} = require("defender-relay-client/lib/ethers");

const HashZero = "0x0000000000000000000000000000000000000000000000000000000000000000";

const stringify = (value) => JSON.stringify(value, null, 2);

exports.handler = async function (credentials) {
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider);

  const registry = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, signer);
  const nodes = new ethers.Contract(NODES_ADDRESS, NODES_ABI, signer);
  const billing = new ethers.Contract(BILLING_ADDRESS, BILLING_ABI, signer);

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
  exports
    .handler({ apiKey, apiSecret })
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
