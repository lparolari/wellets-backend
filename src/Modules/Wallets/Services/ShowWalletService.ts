import AppError from 'Shared/Errors/AppError';
import { inject, injectable } from 'tsyringe';

import Wallet from '../Infra/TypeORM/Entities/Wallet';
import IWalletsRepository from '../Repositories/IWalletsRepository';

interface IRequest {
  wallet_id: string;
  user_id: string;
}

@injectable()
class ShowWalletService {
  constructor(
    @inject('WalletsRepository')
    private walletsRepository: IWalletsRepository,
  ) {}

  public async execute({ user_id, wallet_id }: IRequest): Promise<Wallet> {
    const wallet = await this.walletsRepository.findById(wallet_id);

    if (!wallet) {
      throw new AppError('This wallet does not exist!', 404);
    }

    if (wallet.user_id !== user_id) {
      throw new AppError(
        'You does not have access to manage this wallet!',
        403,
      );
    }

    return wallet;
  }
}

export default ShowWalletService;
