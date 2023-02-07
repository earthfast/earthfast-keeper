const NODE_ID =
  "0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6";

const REGISTRY_ADDRESS = "0xA47A6a03975cbCC7E6F95AFF89c2b0e4856938FA";
const NODES_ADDRESS = "0x0390CEa187B21Fd4188280097e27EDEE455Cbb5D";
const BILLING_ADDRESS = "0x5E4542Bdc9b89403E177086E921BCEFd614319D8";

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
        internalType: "struct ArmadaNode[]",
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

  const billingArgs = [NODE_ID, [...nodeIds], [...uptimeBips]];
  console.log(`Execute ArmadaBilling.processBilling ${stringify(billingArgs)}`);
  const billingTx = await billing.processBilling(...billingArgs);
  console.log(billingTx.hash);
  await billingTx.wait();

  const renewalArgs = [NODE_ID, [...nodeIds]];
  console.log(`Execute ArmadaBilling.processRenewal ${stringify(renewalArgs)}`);
  const renewalTx = await billing.processRenewal(...renewalArgs);
  console.log(renewalTx.hash);
  await renewalTx.wait();

  const advanceArgs = [NODE_ID];
  console.log(`Execute ArmadaRegistry.advanceEpoch ${stringify(advanceArgs)}`);
  const advanceTx = await registry.advanceEpoch(...advanceArgs);
  console.log(advanceTx.hash);
  await advanceTx.wait();
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
