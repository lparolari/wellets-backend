import { injectable, inject } from 'tsyringe';

import AppError from 'Shared/Errors/AppError';
import ICurrenciesRepository from 'Modules/Currencies/Repositories/ICurrenciesRepository';
import IWalletsRepository from '../Repositories/IWalletsRepository';

interface IRequest {
  user_id: string;
  currency_id: string;
}

interface IResponse {
  balance: number;
}

@injectable()
class EstimateTotalBalanceService {
  constructor(
    @inject('WalletsRepository')
    private walletsRepository: IWalletsRepository,

    @inject('CurrenciesRepository')
    private currenciesRepository: ICurrenciesRepository,
  ) {}

  public async execute({ user_id, currency_id }: IRequest): Promise<IResponse> {
    const { wallets } = await this.walletsRepository.findByUserId({
      user_id,
    });

    const baseCurrency = await this.currenciesRepository.findById(currency_id);

    if (!baseCurrency) {
      throw new AppError('The base currency selected does not exist!', 404);
    }

    let totalBalance = 0;

    for (const wallet of wallets) {
      const walletBalance = Number(wallet.balance);

      if (wallet.currency_id === baseCurrency.id) {
        totalBalance += walletBalance;
        continue;
      }

      const walletCurrency = await this.currenciesRepository.findById(
        wallet.currency_id,
      );

      if (!walletCurrency) {
        throw new AppError(
          'Sorry, the currency attached to your wallet was not found!',
          404,
        );
      }

      const baseRate = Number(baseCurrency.dollar_rate);
      const desiredRate = Number(walletCurrency.dollar_rate);

      totalBalance += (baseRate * walletBalance) / desiredRate;
    }

    return {
      balance: totalBalance,
    };
  }
}

export default EstimateTotalBalanceService;
