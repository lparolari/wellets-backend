import cron from 'node-cron';
import { container } from 'tsyringe';

import BalanceSnapshotService from 'Modules/WalletBalances/Services/BalanceSnapshotService';

class SnapshotJob {
  public update(): void {
    const balanceSnapshot = container.resolve(BalanceSnapshotService);

    const shapshotJob = cron.schedule(
      process.env.JOB_SNAPSHOT_CRON_EXPRESSION || '* * * * *',
      () => {
        balanceSnapshot.execute();
      },
    );

    shapshotJob.start();
  }

  public once(): void {
    const balanceSnapshot = container.resolve(BalanceSnapshotService);

    balanceSnapshot.execute();
  }
}

export default SnapshotJob;
