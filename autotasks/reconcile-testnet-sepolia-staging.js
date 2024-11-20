const reconcile = require('./reconcile');

exports.handler = async function(credentials) {
  return reconcile.handler(credentials, './config/testnet-sepolia-staging.js');
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
