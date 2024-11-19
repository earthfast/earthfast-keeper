const reconcile = require('./reconcile');

exports.handler = async function(credentials) {
  return reconcile.handler(credentials, './config/testnet-sepolia-staging.js');
};
