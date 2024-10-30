## armada-keeper

This repo stores the code for reconciliations (billing + payments) and network data backups. At a high level the flow is

1. OZ Defender Autotask (cron) => reconciles billing + payouts, advances epoch
2. Github cron => read network status + execute data dump => create github PR for data backup purposes

#### Setup scripts
To copy the abis from the contracts repo to this repo:
`npm run copy-abi`

To generate the types from the abis:
`npm run gen-types`

#### Autotasks
Autotasks are run by OZ Defender on a cron. The files in the autotask/ folder are just copies.

To run an autotask locally for testing/debugging:
1. Set the values in the .env file for the Relayer
2. `node autotasks/reconcile-*.js`

#### .github workflows
After the Autotasks run on OZ Defender, the data for the chain is dumped into .json files and stored in the data/ folder. The autotask running is a pre-requisite. The scripts called by Github are stored in the `src/` folder

#### src/
Contains the actual scripts to check the status of a chain as well as dump the data state to be stored in the data/ folder

#### OZ Sentinels
Sentinels are alerts for monitors created in OZ Defender but not stored in this repo. You can set triggers on contract calls eg createProject, enableNode and send emails on these triggers