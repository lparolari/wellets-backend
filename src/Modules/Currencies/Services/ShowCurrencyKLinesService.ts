import AppError from 'Shared/Errors/AppError';
import { injectable, inject } from 'tsyringe';

import IRatesProvider from 'Shared/Containers/RatesProvider/Models/IRatesProvider';
import ICurrencyHistoryDTO from 'Shared/Containers/RatesProvider/DTOs/ICurrencyHistoryDTO';
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
  ) {}

  public async execute({
    currency_id,
    interval,
    start_time,
    end_time,
    limit,
  }: IRequest): Promise<IResponse> {
    if (!this.ratesProvider.getHistory) {
      throw new AppError('Provider does not support historical data!');
    }

    const currency = await this.currenciesRepository.findById(currency_id);

    if (!currency) {
      throw new Error('Currency not found!');
    }

    const history = await this.ratesProvider.getHistory(
      currency.acronym,
      interval,
      start_time,
      end_time,
      limit,
    );

    return history;
  }
}

export default ShowCurrencyKLinesService;
