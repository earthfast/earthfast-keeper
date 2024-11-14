const path = require('path');

module.exports = {
  network: 'testnet-sepolia',
  addresses: {
    registry: "0x4E9CC81479cD303D2a581b4fD89372A20b262e35",
    nodes: "0x3e8cc40A3EF74B7eb09D8B4747a307a020E1C71c",
    billing: "0x178E1c93C92b780126b6dfb4bAe14A87E03dBe6C"
  },
  abis: {
    registry: require(path.join(__dirname, '../../abi/testnet-sepolia/EarthfastRegistry.json')).abi,
    nodes: require(path.join(__dirname, '../../abi/testnet-sepolia/EarthfastNodesImpl.json')).abi,
    billing: require(path.join(__dirname, '../../abi/testnet-sepolia/EarthfastBilling.json')).abi
  }
};
