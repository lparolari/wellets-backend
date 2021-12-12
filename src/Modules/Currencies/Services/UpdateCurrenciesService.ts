import { injectable, inject } from 'tsyringe';

import log from 'Shared/Helpers/log';
import IRatesProvider from 'Shared/Containers/RatesProvider/Models/IRatesProvider';
import ICurrenciesRepository from '../Repositories/ICurrenciesRepository';

@injectable()
class UpdateCurrenciesService {
  constructor(
    @inject('CurrenciesRepository')
    private currenciesRepository: ICurrenciesRepository,

    @inject('RatesProvider')
    private ratesProvider: IRatesProvider,
  ) {}

  public async execute(): Promise<void> {
    try {
      const latestCurrenciesRates = await this.ratesProvider.getLatestRates();

      Object.entries(latestCurrenciesRates).forEach(async ([acronym, rate]) => {
        const currencies = await this.currenciesRepository.findAllByAcronym(
          acronym,
        );

        Object.values(currencies).forEach(async currency => {
          const newCurrency = currency;

          newCurrency.dollar_rate = rate;

          await this.currenciesRepository.save(newCurrency);
        });
      });

      log('Currencies rates updated *-*', 'blue');
    } catch (error) {
      log(error.message, 'red');
    }
  }
}

export default UpdateCurrenciesService;
