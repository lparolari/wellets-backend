import GetUserPreferredCurrencyService from 'Modules/Users/Services/GetUserPreferredCurrencyService';
import { changeValue3 } from 'Shared/Helpers/converter';
import { container, inject, injectable } from 'tsyringe';

import IShowTotalAssetBalanceDTO from '../DTOs/IShowTotalAssetBalanceDTO';
import Asset from '../Infra/TypeORM/Entities/Asset';
import IAssetsRepository from '../Repositories/IAssetsRepository';

@injectable()
class GetTotalAssetBalanceService {
  constructor(
    @inject('AssetsRepository')
    private assetsRepository: IAssetsRepository,
  ) {}

  public async execute({
    user_id,
  }: IShowTotalAssetBalanceDTO): Promise<number> {
    const getCurrency = container.resolve(GetUserPreferredCurrencyService);

    const assets = await this.assetsRepository.findByUserId({ user_id });
    const currency = await getCurrency.execute({ user_id });

    const equivalent = (a: Asset) =>
      changeValue3(a.currency.dollar_rate, currency.dollar_rate, a.balance);

    const balance = assets.reduce((sum, asset) => sum + equivalent(asset), 0);

    return balance;
  }
}

export default GetTotalAssetBalanceService;
