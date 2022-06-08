import ICacheProvider from 'Shared/Containers/CacheProvider/Models/ICacheProvider';
import AppError from 'Shared/Errors/AppError';
import { inject, injectable } from 'tsyringe';
import Wallet from '../Infra/TypeORM/Entities/Wallet';

import IWalletsRepository from '../Repositories/IWalletsRepository';

interface IRequest {
  wallet_id: string;
  user_id: string;
}

@injectable()
class DeleteWalletsService {
  constructor(
    @inject('WalletsRepository')
    private walletsRepository: IWalletsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ wallet_id, user_id }: IRequest): Promise<Wallet> {
    const wallet = await this.walletsRepository.findById(wallet_id);

    if (!wallet) {
      throw new AppError('This wallet does not exist!', 404);
    }

    if (wallet.user_id !== user_id) {
      throw new AppError('You are not the owner of this wallet!', 403);
    }

    await this.walletsRepository.delete(wallet_id);

    this.cacheProvider.deleteByPrefix(`wallets:${user_id}`);

    return wallet;
  }
}

export default DeleteWalletsService;
