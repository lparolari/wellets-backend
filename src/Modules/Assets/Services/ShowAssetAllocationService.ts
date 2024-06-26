import GetUserPreferredCurrencyService from 'Modules/Users/Services/GetUserPreferredCurrencyService';
import { changeValue3 } from 'Shared/Helpers/converter';
import { container, inject, injectable } from 'tsyringe';

import IAllocationDTO from '../DTOs/IAllocationDTO';
import IShowAssetAllocationDTO from '../DTOs/IShowAssetAllocationDTO';
import Asset from '../Infra/TypeORM/Entities/Asset';
import IAssetsRepository from '../Repositories/IAssetsRepository';
import GetTotalAssetBalanceService from './GetTotalAssetBalanceService';

@injectable()
class ShowAssetAllocationService {
  constructor(
    @inject('AssetsRepository')
    private assetsRepository: IAssetsRepository,
  ) {}

  public async execute({
    user_id,
  }: IShowAssetAllocationDTO): Promise<IAllocationDTO[]> {
    const getCurrency = container.resolve(GetUserPreferredCurrencyService);
    const getTotalAssetBalance = container.resolve(GetTotalAssetBalanceService);

    const assets = await this.assetsRepository.findByUserId({ user_id });
    const currency = await getCurrency.execute({ user_id });

    const total = await getTotalAssetBalance.execute({ user_id });

    const equivalent = (asset: Asset): number =>
      changeValue3(
        asset.currency.dollar_rate,
        currency.dollar_rate,
        asset.balance,
      );

    const allocation = assets.map(asset => ({
      balance: equivalent(asset),
      allocation: equivalent(asset) / total,
      asset,
    }));

    return allocation;
  }
}

export default ShowAssetAllocationService;
