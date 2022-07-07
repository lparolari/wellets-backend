import AppError from 'Shared/Errors/AppError';
import { injectable, inject, container } from 'tsyringe';

import ShowCurrencyRate from 'Modules/Currencies/Services/ShowCurrencyRate';
import ShowCurrencyService from 'Modules/Currencies/Services/ShowCurrencyService';
import IWalletsRepository from '../Repositories/IWalletsRepository';

interface IRequest {
  wallet_id: string;
  currency_id: string;
  user_id: string;
}

interface IResponse {
  balance: number;
}

@injectable()
class ShowWalletBalance {
  constructor(
    @inject('WalletsRepository')
    private walletsRepository: IWalletsRepository,
  ) {}

  public async execute({
    currency_id,
    wallet_id,
    user_id,
  }: IRequest): Promise<IResponse> {
    const showCurrency = container.resolve(ShowCurrencyService);
    const showCurrencyRate = container.resolve(ShowCurrencyRate);

    const wallet = await this.walletsRepository.findById(wallet_id);

    if (!wallet || wallet.user_id !== user_id) {
      throw new AppError('Wallet not found!', 404);
    }

    const currency = await showCurrency.execute({
      currency_id,
      user_id,
    });

    const rate = await showCurrencyRate.execute({
      base_currency: wallet.currency.acronym,
      target_currency: currency.acronym,
      user_id,
    });

    const balance = rate.rate * wallet.balance;

    return {
      balance,
    };
  }
}

export default ShowWalletBalance;
