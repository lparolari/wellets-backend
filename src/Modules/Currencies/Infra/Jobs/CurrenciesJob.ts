import cron from 'node-cron';
import { container } from 'tsyringe';

import UpdateCurrenciesService from '../../Services/UpdateCurrenciesService';

class CurrenciesJob {
  public update(): void {
    const updateCurrencies = container.resolve(UpdateCurrenciesService);

    const updateJob = cron.schedule(
      process.env.JOB_RATES_CRON_EXPRESSION || '* * * * *',
      () => {
        updateCurrencies.execute();
      },
    );

    updateJob.start();
  }

  public once(): void {
    const updateCurrencies = container.resolve(UpdateCurrenciesService);
    updateCurrencies.execute();
  }
}

export default CurrenciesJob;
