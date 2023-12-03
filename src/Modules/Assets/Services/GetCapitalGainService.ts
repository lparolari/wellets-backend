import ICurrenciesRepository from 'Modules/Currencies/Repositories/ICurrenciesRepository';
import ConvertCurrencyService from 'Modules/Currencies/Services/ConvertCurrencyService';
import GetUserPreferredCurrencyService from 'Modules/Users/Services/GetUserPreferredCurrencyService';
import AppError from 'Shared/Errors/AppError';
import { container, inject, injectable } from 'tsyringe';

import IAssetsRepository from '../Repositories/IAssetsRepository';
import GetAverageLoadPriceService from './GetAverageLoadPriceService';

type CapitalGainRequest = {
  user_id: string;
  asset_id: string;
};

type CapitalGainResponse = {
  current_price: number;
  basis_price: number;
  gain_amount: number;
  gain_rate: number;
};

@injectable()
class GetCapitalGainService {
  constructor(
    @inject('AssetsRepository')
    private assetsRepository: IAssetsRepository,

    @inject('CurrenciesRepository')
    private currenciesRepository: ICurrenciesRepository,
  ) {}

  public async execute({
    user_id,
    asset_id,
  }: CapitalGainRequest): Promise<CapitalGainResponse> {
    const getUserCurrency = container.resolve(GetUserPreferredCurrencyService);
    const convertCurrency = container.resolve(ConvertCurrencyService);
    const getAverageLoadPrice = container.resolve(GetAverageLoadPriceService);

    const asset = await this.assetsRepository.findById(asset_id);

    if (!asset || asset.user_id !== user_id) {
      throw new AppError('Asset not found!');
    }

    const asset_currency = await this.currenciesRepository.findById(
      asset.currency_id,
    );

    if (!asset_currency) {
      throw new AppError('Asset currency not found!');
    }

    const user_currency = await getUserCurrency.execute({ user_id });

    const current_asset_price = await convertCurrency.execute({
      from: asset_currency.acronym,
      to: user_currency.acronym,
      amount: 1,
    });

    const basis_asset_price = await getAverageLoadPrice.execute({
      user_id,
      asset_id,
    });

    const current_price = current_asset_price;
    const basis_price = basis_asset_price;
    const gain_amount = asset.balance * (current_price - basis_price);
    const gain_rate = 1 - basis_asset_price / current_asset_price;

    return {
      current_price,
      basis_price,
      gain_amount,
      gain_rate,
    };
  }
}

export default GetCapitalGainService;
