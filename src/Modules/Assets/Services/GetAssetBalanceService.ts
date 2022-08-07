import GetUserPreferredCurrencyService from 'Modules/Users/Services/GetUserPreferredCurrencyService';
import { changeValue3 } from 'Shared/Helpers/converter';
import { container, inject, injectable } from 'tsyringe';

import IShowAssetBalanceDTO from '../DTOs/IShowAssetBalanceDTO';
import Asset from '../Infra/TypeORM/Entities/Asset';
import IAssetsRepository from '../Repositories/IAssetsRepository';

@injectable()
class GetAssetBalanceService {
  constructor(
    @inject('AssetsRepository')
    private assetsRepository: IAssetsRepository,
  ) {}

  public async execute({ user_id }: IShowAssetBalanceDTO): Promise<number> {
    const getCurrency = container.resolve(GetUserPreferredCurrencyService);

    const assets = await this.assetsRepository.findByUserId({ user_id });
    const currency = await getCurrency.execute({ user_id });

    const countervalue = (asset: Asset) =>
      changeValue3(
        asset.currency.dollar_rate,
        currency.dollar_rate,
        asset.balance,
      );

    const balance = assets.reduce((sum, asset) => sum + countervalue(asset), 0);

    return balance;
  }
}

export default GetAssetBalanceService;
