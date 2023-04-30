import AppError from 'Shared/Errors/AppError';
import { injectable, inject } from 'tsyringe';

import IRatesProvider from 'Shared/Containers/RatesProvider/Models/IRatesProvider';
import ICurrencyHistoryDTO from 'Shared/Containers/RatesProvider/DTOs/ICurrencyHistoryDTO';
import ICacheProvider from 'Shared/Containers/CacheProvider/Models/ICacheProvider';
import ICurrenciesRepository from '../Repositories/ICurrenciesRepository';

type IRequest = {
  currency_id: string;
  interval: string;
  start_time: Date;
  end_time: Date;
  limit: number;
};

type IResponse = ICurrencyHistoryDTO;

@injectable()
class ShowCurrencyKLinesService {
  constructor(
    @inject('CurrenciesRepository')
    private currenciesRepository: ICurrenciesRepository,

    @inject('RatesProvider')
    private ratesProvider: IRatesProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ currency_id, ...rest }: IRequest): Promise<IResponse> {
    if (!this.ratesProvider.getHistory) {
      throw new AppError('Provider does not support historical data!');
    }

    const currency = await this.currenciesRepository.findById(currency_id);

    if (!currency) {
      throw new Error('Currency not found!');
    }

    const cacheKey = `currency-history:${currency_id}:${JSON.stringify(rest)}`;

    let history = await this.cacheProvider.find<IResponse>(cacheKey);

    if (!history) {
      history = await this.ratesProvider.getHistory(
        currency.acronym,
        rest.interval,
        rest.start_time,
        rest.end_time,
        rest.limit,
      );
      this.cacheProvider.save(cacheKey, history);
    }

    return history;
  }
}

export default ShowCurrencyKLinesService;
