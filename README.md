# Earthfast Keeper

This repository contains the code for maintaining the Earthfast network through reconciliations (billing + payments) and network data backups.

## Project Overview

Earthfast Keeper is a critical component of the Earthfast infrastructure that handles several important tasks:

- **Billing Reconciliation**: Processes billing for node operators based on uptime and usage
- **Payment Processing**: Manages payouts to operators and ensures proper accounting
- **Epoch Management**: Advances the network through epochs to maintain sync
- **Data Backups**: Creates snapshots of the network state for backup and analysis

The system uses two main automation mechanisms:
1. **OpenZeppelin Defender Autotasks**: Run on scheduled intervals to reconcile billing, process payments, and advance epochs
2. **GitHub Actions Workflows**: Monitor network status and create data dumps for backup purposes

## Architecture

The project is structured as follows:

- **autotasks/**: Scripts executed by OpenZeppelin Defender to perform reconciliation
- **src/**: Core functionality for checking network status and dumping/restoring network data
- **abi/**: Contract ABIs for interacting with the Earthfast smart contracts
- **types/**: TypeScript type definitions generated from ABIs
- **data/**: Network state data backups
- **.github/workflows/**: CI/CD pipelines for automated tasks

## High-Level Flow

1. OZ Defender Autotask (cron) => reconciles billing + payouts, advances epoch
2. Github cron => read network status + execute data dump => create github PR for data backup purposes

## Setup Guide

This section provides step-by-step instructions to set up the development environment for the earthfast-keeper project.

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [npm](https://www.npmjs.com/)
- Access to the Sepolia testnet (via Infura, Alchemy, or another provider)
- OpenZeppelin Defender account for managing relayers
- Slack workspace (if you want to receive notifications)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/earthfast-keeper.git
   cd earthfast-keeper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file template:
   ```bash
   cp .env.example .env
   ```

4. Set up your environment variables in the `.env` file (see section below for details on obtaining these credentials)

### Obtaining API Keys and Credentials

#### Ethereum RPC URL
1. Create an account on [Infura](https://infura.io/) or [Alchemy](https://www.alchemy.com/)
2. Create a new project for Ethereum
3. Select the Sepolia testnet
4. Copy the provided RPC URL (it should look like `https://sepolia.infura.io/v3/YOUR_API_KEY`)
5. Add this URL to your `.env` file as `RPC_URL`

#### OpenZeppelin Defender Relayer
1. Create an account on [OpenZeppelin Defender](https://defender.openzeppelin.com/)
2. Navigate to "Relayers" section
3. Click "Create Relayer"
4. Select the network (Sepolia)
5. Provide a name for your relayer (e.g., "Earthfast Keeper Sepolia")
6. Once created, click on the relayer to view its details
7. Copy the API key and Secret key
8. Add these to your `.env` file as `RELAYER_API_KEY` and `RELAYER_API_SECRET`

#### Deployer Private Key (Only for Restore Operations)
1. **IMPORTANT**: This is only needed if you're planning to restore contract data
2. Use a wallet like MetaMask to create or import an Ethereum account
3. Ensure this account has some ETH for gas on the Sepolia testnet
4. Export the private key from your wallet
5. Add this to your `.env` file as `DEPLOYER_PRIVATE_KEY`
6. Never share this private key or commit it to version control

#### Guardian Address (Only for Restore Operations)
1. This is the Ethereum address that will be set as the administrator for the contracts during restoration
2. Use the public address of a trusted wallet (e.g., your MetaMask account)
3. Add this to your `.env` file as `GUARDIAN_ADDRESS`

#### Slack Webhook (Optional)
1. Go to your Slack workspace
2. Create a new Slack App at [api.slack.com/apps](https://api.slack.com/apps)
3. Enable "Incoming Webhooks" for your app
4. Create a new webhook for a specific channel
5. Copy the webhook URL
6. This will be used in GitHub Secrets if you set up the CI/CD workflows

### Setting Up for Development

After configuring your environment variables, you're ready to set up the local development environment:

1. Copy ABIs from the contracts repository:
   ```bash
   npm run copy-abi
   ```

2. Generate TypeScript types from ABIs:
   ```bash
   npm run gen-types
   ```

3. To test a reconciliation task locally:
   ```bash
   node autotasks/reconcile-testnet-sepolia.js
   ```

### Testing Scripts

You can run various scripts to interact with the blockchain:

- Check reconciliation status:
  ```bash
  npx ts-node src/checkReconcile.ts --network testnet-sepolia
  ```

- Dump chain data:
  ```bash
  npx ts-node src/dump.ts --network testnet-sepolia
  ```

- Check network status:
  ```bash
  npx ts-node src/status.ts --network testnet-sepolia
  ```

## Project Structure

### Autotasks
Autotasks are run by OZ Defender on a cron. The files in the autotask/ folder are just copies.

To run an autotask locally for testing/debugging:
1. Set the values in the .env file for the Relayer
2. `node autotasks/reconcile-*.js`

### GitHub Workflows
After the Autotasks run on OZ Defender, the data for the chain is dumped into .json files and stored in the data/ folder. The autotask running is a pre-requisite. The scripts called by Github are stored in the `src/` folder.

### Source Code
The `src/` directory contains the actual scripts to check the status of a chain as well as dump the data state to be stored in the data/ folder.

### OZ Sentinels
Sentinels are alerts for monitors created in OZ Defender but not stored in this repo. You can set triggers on contract calls eg createProject, enableNode and send emails on these triggers.

## CI/CD Configuration

This project uses GitHub Actions for automating tasks such as reconciliation, billing, and data backups. For these workflows to function properly, you need to configure the following secrets in your GitHub repository:

| Secret Name | Description | How to Obtain |
|-------------|-------------|--------------|
| `SEPOLIA_RPC_URL` | RPC endpoint URL for accessing the Sepolia testnet | Create an account with Infura or Alchemy and get an endpoint URL for Sepolia |
| `RPC_URL` | Generic RPC endpoint URL used by some workflows (like dump.yml) | Same as SEPOLIA_RPC_URL or create a separate endpoint |
| `RELAYER_API_KEY_SEPOLIA` | OpenZeppelin Defender Relayer API key for Sepolia | Create a Relayer in OpenZeppelin Defender for the Sepolia network |
| `RELAYER_API_SECRET_SEPOLIA` | OpenZeppelin Defender Relayer API secret for Sepolia | Obtained together with the API key when creating a Relayer |
| `RELAYER_API_KEY_SEPOLIA_STAGING` | OpenZeppelin Defender Relayer API key for Sepolia staging | Create a separate Relayer for the staging environment |
| `RELAYER_API_SECRET_SEPOLIA_STAGING` | OpenZeppelin Defender Relayer API secret for Sepolia staging | Obtained together with the API key |
| `SLACK_WEBHOOK_URL` | Slack webhook URL for notifications | Set up a Slack App and create an incoming webhook |

### Workflow-Secret Relationships

- **billing-and-epoch-sepolia.yml**: Uses `SEPOLIA_RPC_URL`, `RELAYER_API_KEY_SEPOLIA`, `RELAYER_API_SECRET_SEPOLIA`, and `SLACK_WEBHOOK_URL` to run reconciliation tasks on the Sepolia network.
- **billing-and-epoch-sepolia-staging.yml**: Uses `SEPOLIA_RPC_URL`, `RELAYER_API_KEY_SEPOLIA_STAGING`, `RELAYER_API_SECRET_SEPOLIA_STAGING`, and `SLACK_WEBHOOK_URL` to run reconciliation tasks on the Sepolia staging environment.
- **dump.yml**: Uses `RPC_URL` to fetch and store blockchain data for backup purposes.
- **cron-testnet-sepolia.yml** and **cron-testnet-sepolia-staging.yml**: Trigger workflows using `SEPOLIA_RPC_URL`.

### How to Configure GitHub Secrets

1. Navigate to your repository on GitHub
2. Go to "Settings" > "Secrets and variables" > "Actions"
3. Click on "New repository secret"
4. Enter the name and value for each secret
5. Repeat for each required secret

## Contract Addresses

This repository contains contract addresses for deployments on the Sepolia testnet and Sepolia staging environments. These addresses are intentionally public as they are deployed on public testnets and are already visible on blockchain explorers like Etherscan.

The contract addresses are used in the following files:
- `autotasks/config/testnet-sepolia.js` and `autotasks/config/testnet-sepolia-staging.js`: Main contract references
- `abi/testnet-sepolia/*.json` and `abi/testnet-sepolia-staging/*.json`: Contract ABIs and addresses
- `src/restore.ts`: USDC token addresses

If you're forking this repository for your own use, you may want to deploy your own contracts and update these addresses accordingly.

## Security

This project follows security best practices for credential management:

1. **No Hardcoded Credentials**: No API keys, tokens, private keys, or other sensitive information is hardcoded in the source code.

2. **Environment Variables**: All sensitive information is managed through environment variables:
   - Local development uses `.env` file (gitignored)
   - CI/CD pipelines use GitHub Secrets

3. **Sensitive Information**: Contributors should never commit any of the following to the repository:
   - Private keys
   - API keys or secrets
   - Access tokens
   - RPC URLs with embedded credentials

4. **Security Review**: The codebase has been reviewed to ensure no credentials are exposed.

If you discover any security vulnerabilities or hardcoded credentials that might have been missed, please report them immediately by creating an issue.

## Contributing

Contributions to Earthfast Keeper are welcome! Here's how you can contribute:

1. **Fork the Repository**: Create your own fork of the project
2. **Create a Branch**: Make your changes in a new branch
3. **Submit a Pull Request**: Open a PR with a clear description of your changes

### Contribution Guidelines

- Follow the existing code style and patterns
- Write clear commit messages
- Include tests for new functionality
- Update documentation for any changed features
- Ensure all tests pass before submitting a PR

### Development Workflow

1. Pick an issue or feature to work on
2. Set up your local development environment following the setup guide
3. Make your changes and test thoroughly
4. Submit a pull request for review

## Troubleshooting

### Common Issues

- **Connection Issues**: If you're having trouble connecting to the Sepolia testnet, ensure your RPC URL is correct and your provider service is working.
- **Relayer Errors**: Make sure your OpenZeppelin Defender Relayer has enough funds and proper permissions.
- **Workflow Failures**: Check the GitHub Actions logs for detailed error information.

### Getting Help

If you encounter any issues not covered here, please open an issue on GitHub with:
- A detailed description of the problem
- Steps to reproduce
- Environment information (Node.js version, etc.)

## License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.
