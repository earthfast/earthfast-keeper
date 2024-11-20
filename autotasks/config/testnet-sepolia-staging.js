const path = require('path');

module.exports = {
  network: 'testnet-sepolia-staging',
  addresses: {
    registry: "0x69e4aa095489E8613B4C4d396DD916e66D66aE23",
    nodes: "0x7ae226bf32bf4B23A019408c62e0626872b63E9D",
    billing: "0xa8e998C4e99E901938f9d577314a67f3f92cAB4e"
  },
  abis: {
    registry: require(path.join(__dirname, '../../abi/testnet-sepolia-staging/EarthfastRegistry.json')).abi,
    nodes: require(path.join(__dirname, '../../abi/testnet-sepolia-staging/EarthfastNodes.json')).abi,
    billing: require(path.join(__dirname, '../../abi/testnet-sepolia-staging/EarthfastBilling.json')).abi
  }
};
