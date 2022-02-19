import CurrenciesJob from 'Modules/Currencies/Infra/Jobs/CurrenciesJob';
import SnapshotJob from 'Modules/WalletBalances/Infra/Jobs/SnapshotJob';

class Jobs {
  private currenciesJob = new CurrenciesJob();

  private snapshotJob = new SnapshotJob();

  public run(): void {
    this.currenciesJob.update();
    this.snapshotJob.update();
  }

  public once(): void {
    this.currenciesJob.once();
    this.snapshotJob.once();
  }
}

export default Jobs;
