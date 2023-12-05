## armada-keeper

This repo stores the code for reconciliations (billing + payments) and network data backups. At a high level the flow is

1. Defender Autotask (cron) => reconciles billing + payouts. This uses Defender Relayer to pay for transactions. The autotasks are stored in the `autotasks/` folder
2. Github cron => read network status + execute data dump => create github PR for data backup purposes. The scripts called by Github are stored in the `src/` folder
3. Defender Sentitels => triggers on contract calls => send email notifications for monitoring purposes.


