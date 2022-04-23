import cron from 'node-cron';
import { container } from 'tsyringe';

import SyncCurrenciesService from '../../Services/SyncCurrenciesService';

class CurrenciesJob {
  public update(): void {
    const updateCurrencies = container.resolve(SyncCurrenciesService);

    const updateJob = cron.schedule(
      process.env.JOB_RATES_CRON_EXPRESSION || '* * * * *',
      () => {
        updateCurrencies.execute();
      },
    );

    updateJob.start();
  }

  public once(): void {
    const updateCurrencies = container.resolve(SyncCurrenciesService);
    updateCurrencies.execute();
  }
}

export default CurrenciesJob;
