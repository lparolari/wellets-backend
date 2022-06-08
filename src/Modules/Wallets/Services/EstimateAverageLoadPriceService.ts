import { injectable, inject, container } from 'tsyringe';

import AppError from 'Shared/Errors/AppError';
import ICurrenciesRepository from 'Modules/Currencies/Repositories/ICurrenciesRepository';
import ITransactionsRepository from 'Modules/Transactions/Repositories/ITransactionsRepository';
import * as R from 'ramda';
import { change, changeValue } from 'Shared/Helpers/converter';
import ShowUserSettingsService from 'Modules/Users/Services/ShowUserSettingsService';
import Currency from 'Modules/Currencies/Infra/TypeORM/Entities/Currency';
import IWalletsRepository from '../Repositories/IWalletsRepository';

interface IRequest {
  user_id: string;
  wallet_id: string;
  currency_id?: string;
}

interface IResponse {
  average_load_price: number;
  base_currency: Currency;
}

@injectable()
class EstimateAverageLoadPriceService {
  constructor(
    @inject('WalletsRepository')
    private walletsRepository: IWalletsRepository,

    @inject('CurrenciesRepository')
    private currenciesRepository: ICurrenciesRepository,

    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,
  ) {}

  public async execute({
    user_id,
    currency_id,
    wallet_id,
  }: IRequest): Promise<IResponse> {
    const showUserSettings = container.resolve(ShowUserSettingsService);

    const wallet = await this.walletsRepository.findById(wallet_id);

    if (!wallet || wallet.user_id !== user_id) {
      throw new AppError('Wallet not found!', 404);
    }

    let currency: Currency;

    if (currency_id) {
      currency = await this.currenciesRepository.findById(currency_id);

      if (!currency) {
        throw new AppError('Currency not found!', 404);
      }
    } else {
      currency = (await showUserSettings.execute({ user_id })).currency;

      if (!currency) {
        throw new AppError('Currency not found!', 404);
      }
    }

    const { transactions } = await this.transactionsRepository.findByWalletId(
      {
        wallet_id,
      },
      false,
    );

    const values = R.pluck('value', transactions);
    const dollarRates = R.pluck('dollar_rate', transactions);

    const weightedDollarValues = R.zipWith(
      (weight: number, dollarRate: number) => weight * change(dollarRate)(1),
      values,
      dollarRates,
    );

    const sum = R.sum(weightedDollarValues);
    const total = R.sum(values);

    const changeUsdTarget = changeValue(1)(currency.dollar_rate);

    const average_load_price = changeUsdTarget(sum / total);

    return { average_load_price, base_currency: currency };
  }
}

export default EstimateAverageLoadPriceService;
