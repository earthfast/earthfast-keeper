const path = require('path');

module.exports = {
  network: 'testnet-sepolia-staging',
  addresses: {
    registry: "0xA73F1bd17a7F60374A6d4c511fBaebfDb3Bf774a",
    nodes: "0x56247F96bb7DaC09F6120E8Ad084a20aBA00B477",
    billing: "0x6Ecf1465065BbC2dA97F0AB845ff651f6de3dCBF"
  },
  abis: {
    registry: require(path.join(__dirname, '../../abi/testnet-sepolia-staging/EarthfastRegistry.json')).abi,
    nodes: require(path.join(__dirname, '../../abi/testnet-sepolia-staging/EarthfastNodesImpl.json')).abi,
    billing: require(path.join(__dirname, '../../abi/testnet-sepolia-staging/EarthfastBilling.json')).abi
  }
};
