import { inject, injectable } from 'tsyringe';

import AppError from 'Shared/Errors/AppError';
import ICacheProvider from 'Shared/Containers/CacheProvider/Models/ICacheProvider';
import Wallet from '../Infra/TypeORM/Entities/Wallet';
import IWalletsRepository from '../Repositories/IWalletsRepository';
import IUpdateWalletDTO from '../DTOs/IUpdateWalletDTO';

@injectable()
class UpdateWalletService {
  constructor(
    @inject('WalletsRepository')
    private walletsRepository: IWalletsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    wallet_id,
    user_id,
    alias,
    balance,
  }: IUpdateWalletDTO): Promise<Wallet> {
    const wallet = await this.walletsRepository.findById(wallet_id);

    if (!wallet || wallet.user_id !== user_id) {
      throw new AppError('This wallet does not exist!', 404);
    }

    const exists = await this.walletsRepository.findByUserIdAndAlias(
      user_id,
      alias,
    );

    if (exists && exists.id !== wallet_id) {
      throw new AppError('This alias is already in use!', 409);
    }

    const updated = await this.walletsRepository.update(wallet_id, {
      alias,
      balance,
    });

    this.cacheProvider.deleteByPrefix(`wallets:${user_id}`);

    return updated;
  }
}

export default UpdateWalletService;
