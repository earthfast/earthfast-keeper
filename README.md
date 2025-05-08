# Earthfast Keeper
Repository for maintaining the Earthfast network through reconciliations (billing + payments) and network data backups. At a high level the flow is:

1. OZ Defender Autotask (cron) => reconciles billing + payouts, advances epoch
2. Github cron => read network status + execute data dump => create github PR for data backup purposes

## Overview
Earthfast Keeper handles:
- Billing reconciliation for node operators
- Payment processing
- Epoch management
- Network data backups

The system uses:
- OpenZeppelin Defender Autotasks (scheduled tasks)
- GitHub Actions Workflows (monitoring and backups)

## Project Structure
- **autotasks/**: Scripts executed by OpenZeppelin Defender. Files here are copies of the ones stored in OZ Defender.
- **src/**: Core functionality for checking network status and dumping data state to be stored in the data/ folder.
- **abi/**: Contract ABIs for Earthfast smart contracts
- **types/**: TypeScript type definitions
- **data/**: Network state data backups
- **.github/workflows/**: CI/CD pipelines

## Setup Guide
### Prerequisites
- Node.js v16+
- Access to Sepolia testnet
- OpenZeppelin Defender account

### Installation
1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/yourusername/earthfast-keeper.git
   cd earthfast-keeper
   npm install
   ```

2. Set up environment variables:

   Copy the environment file template and edit with your values:
   ```bash
   cp .env.example .env
   ```

3. Set up development environment:

   Copy the ABIs from the contracts repository and generate TypeScript types:
   ```bash
   npm run copy-abi
   npm run gen-types
   ```

## Usage
- To run an autotask locally for testing/debugging:
  1. Set the values in the .env file for the Relayer
  2. ```bash
     node autotasks/reconcile-*.js
     ```

- Check network status:
  ```bash
  npx ts-node src/status.ts --network testnet-sepolia
  ```

- Dump chain data:
  ```bash
  npx ts-node src/dump.ts --network testnet-sepolia
  ```

## How It Works

### Autotasks
Autotasks are run by OZ Defender on a cron schedule.

### GitHub Workflows
After the Autotasks run on OZ Defender, the data for the chain is dumped into .json files and stored in the data/ folder. The autotask running is a pre-requisite. The scripts called by Github are stored in the `src/` folder.

### OZ Sentinels
Sentinels are alerts for monitors created in OZ Defender but not stored in this repo. You can set triggers on contract calls eg createProject, enableNode and send emails on these triggers.

## License
This project is licensed under the [MIT License](LICENSE).
