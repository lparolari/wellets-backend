import GetUserPreferredCurrencyService from 'Modules/Users/Services/GetUserPreferredCurrencyService';
import AppError from 'Shared/Errors/AppError';
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

  public async execute({
    user_id,
    asset_id,
  }: IShowAssetBalanceDTO): Promise<number> {
    const getCurrency = container.resolve(GetUserPreferredCurrencyService);

    const asset = await this.assetsRepository.findById(asset_id);

    if (!asset || asset.user_id !== user_id) {
      throw new AppError('Asset not found!');
    }

    const currency = await getCurrency.execute({ user_id });

    const equivalent = (a: Asset) =>
      changeValue3(a.currency.dollar_rate, currency.dollar_rate, a.balance);

    const balance = equivalent(asset);

    return balance;
  }
}

export default GetAssetBalanceService;
