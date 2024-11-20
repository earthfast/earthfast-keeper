const path = require('path');

module.exports = {
  network: 'testnet-sepolia',
  addresses: {
    registry: "0xb1c5F9914648403cb32a4f83B0fb946E5f7702CC",
    nodes: "0x8B1737f02acC78F5f84a59cDB789ff0e6d3974c5",
    billing: "0xfCeAF96975C2c5144279491c08cc927C5702D5Cd"
  },
  abis: {
    registry: require(path.join(__dirname, '../../abi/testnet-sepolia/EarthfastRegistry.json')).abi,
    nodes: require(path.join(__dirname, '../../abi/testnet-sepolia/EarthfastNodes.json')).abi,
    billing: require(path.join(__dirname, '../../abi/testnet-sepolia/EarthfastBilling.json')).abi
  }
};
