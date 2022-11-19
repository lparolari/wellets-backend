import GetUserPreferredCurrencyService from 'Modules/Users/Services/GetUserPreferredCurrencyService';
import { change, changeValue } from 'Shared/Helpers/converter';
import { container, inject, injectable } from 'tsyringe';

import * as R from 'ramda';
import IShowAverageLoadPriceDTO from '../DTOs/IShowAverageLoadPriceDTO';
import IAssetsRepository from '../Repositories/IAssetsRepository';

@injectable()
class GetAverageLoadPriceService {
  constructor(
    @inject('AssetsRepository')
    private assetsRepository: IAssetsRepository,
  ) {}

  public async execute({
    user_id,
    asset_id,
  }: IShowAverageLoadPriceDTO): Promise<number> {
    const getCurrency = container.resolve(GetUserPreferredCurrencyService);

    const currency = await getCurrency.execute({ user_id });
    const asset = await this.assetsRepository.findById(asset_id);
    const entries = await this.assetsRepository.findEntriesByAssetId(asset.id);

    const values = R.pluck('value', entries);
    const dollarRates = R.pluck('dollar_rate', entries);

    const weightedDollarValues = R.zipWith(
      (weight: number, dollarRate: number) => weight * change(dollarRate)(1),
      values,
      dollarRates,
    );

    const sum = R.sum(weightedDollarValues);
    const total = R.sum(values);

    const changeUsdTarget = changeValue(1)(currency.dollar_rate);

    if (total === 0) {
      return 0;
    }

    return changeUsdTarget(sum / total);
  }
}

export default GetAverageLoadPriceService;
