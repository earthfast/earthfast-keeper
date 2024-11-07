const REGISTRY_ADDRESS = "0x4E9CC81479cD303D2a581b4fD89372A20b262e35";
const NODES_ADDRESS = "0x3e8cc40A3EF74B7eb09D8B4747a307a020E1C71c";
const BILLING_ADDRESS = "0x178E1c93C92b780126b6dfb4bAe14A87E03dBe6C";

const REGISTRY_ABI = [
  {
    inputs: [
      { internalType: "bytes32", name: "topologyNodeId", type: "bytes32" },
    ],
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
      { internalType: "bool", name: "topology", type: "bool" },
    ],
    name: "getNodeCount",
    outputs: [{ internalType: "uint256", name: "count", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "operatorIdOrZero", type: "bytes32" },
      { internalType: "bool", name: "topology", type: "bool" },
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
          { internalType: "bool", name: "topology", type: "bool" },
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
      { internalType: "bytes32", name: "topologyNodeId", type: "bytes32" },
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
      { internalType: "bytes32", name: "topologyNodeId", type: "bytes32" },
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
const NODE_ID = "0x0000000000000000000000000000000000000000000000000000000000000000";

const stringify = (value) => JSON.stringify(value, null, 2);

exports.handler = async function (credentials) {
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider);

  const registry = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, signer);
  const nodes = new ethers.Contract(NODES_ADDRESS, NODES_ABI, signer);
  const billing = new ethers.Contract(BILLING_ADDRESS, BILLING_ABI, signer);

  const nodeCount = await nodes.getNodeCount(HashZero, false);
  const nodeData = await nodes.getNodes(HashZero, false, 0, nodeCount);
  const nodeIds = nodeData.map((n) => n.id);
  const uptimeBips = nodeData.map(() => 10000);

  try {
    const billingArgs = [NODE_ID, [...nodeIds], [...uptimeBips]];
    console.log(`Execute EarthfastBilling.processBilling ${stringify(billingArgs)}`);
    const billingTx = await billing.processBilling(...billingArgs);
    console.log(billingTx.hash);
    await billingTx.wait();
  } catch (e) {
    console.error("Error processing EarthfastBilling.processBilling", e);
  }

  try {
    const renewalArgs = [NODE_ID, [...nodeIds]];
    console.log(`Execute EarthfastBilling.processRenewal ${stringify(renewalArgs)}`);
    const renewalTx = await billing.processRenewal(...renewalArgs);
    console.log(renewalTx.hash);
    await renewalTx.wait();
  } catch (e) {
    console.error("Error processing EarthfastBilling.processRenewal", e);
  }

  try {
    const advanceArgs = [NODE_ID];
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
