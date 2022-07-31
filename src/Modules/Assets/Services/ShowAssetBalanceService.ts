import GetUserPreferredCurrencyService from 'Modules/Users/Services/GetUserPreferredCurrencyService';
import { changeValue3 } from 'Shared/Helpers/converter';
import { container, inject, injectable } from 'tsyringe';

import IShowAssetBalanceDTO from '../DTOs/IShowAssetBalanceDTO';
import IAssetsRepository from '../Repositories/IAssetsRepository';

@injectable()
class ShowAssetBalanceService {
  constructor(
    @inject('AssetsRepository')
    private assetsRepository: IAssetsRepository,
  ) {}

  public async execute({ user_id }: IShowAssetBalanceDTO): Promise<number> {
    const getCurrency = container.resolve(GetUserPreferredCurrencyService);

    const assets = await this.assetsRepository.findByUserId({ user_id });
    const currency = await getCurrency.execute({ user_id });

    const allocation = assets.reduce(
      (sum, asset) =>
        sum +
        changeValue3(
          asset.currency.dollar_rate,
          currency.dollar_rate,
          asset.balance,
        ),
      0,
    );

    return allocation;
  }
}

export default ShowAssetBalanceService;
