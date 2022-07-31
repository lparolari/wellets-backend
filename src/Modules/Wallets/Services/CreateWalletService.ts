import { container, inject, injectable } from 'tsyringe';

import AppError from 'Shared/Errors/AppError';
import ICurrenciesRepository from 'Modules/Currencies/Repositories/ICurrenciesRepository';
import ICacheProvider from 'Shared/Containers/CacheProvider/Models/ICacheProvider';
import ShowAssetService from 'Modules/Assets/Services/ShowAssetService';
import UpdateAssetBalanceService from 'Modules/Assets/Services/UpdateAssetBalanceService';
import Wallet from '../Infra/TypeORM/Entities/Wallet';
import ICreateWalletDTO from '../DTOs/ICreateWalletDTO';
import IWalletsRepository from '../Repositories/IWalletsRepository';

@injectable()
class CreateWalletService {
  constructor(
    @inject('WalletsRepository')
    private walletsRepository: IWalletsRepository,

    @inject('CurrenciesRepository')
    private currenciesRepository: ICurrenciesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    alias,
    currency_id,
    user_id,
    balance,
  }: ICreateWalletDTO): Promise<Wallet> {
    const showAsset = container.resolve(ShowAssetService);
    const updateAssetBalance = container.resolve(UpdateAssetBalanceService);

    const exists = await this.walletsRepository.findByUserIdAndAlias(
      user_id,
      alias,
    );

    if (exists) {
      throw new AppError('You already have a wallet with this alias!');
    }

    const currency = await this.currenciesRepository.findById(currency_id);

    if (!currency) {
      throw new AppError('The wallet must has a valid currency!', 404);
    }

    const wallet = await this.walletsRepository.create({
      alias,
      currency_id,
      user_id,
      balance,
    });

    const asset = await showAsset.execute({
      user_id,
      currency_id,
    });

    await updateAssetBalance.execute({
      asset_id: asset.id,
      balance,
    });

    this.cacheProvider.deleteByPrefix(`wallets:${user_id}`);

    return wallet;
  }
}

export default CreateWalletService;
