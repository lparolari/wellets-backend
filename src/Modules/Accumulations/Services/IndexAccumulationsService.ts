import IWalletsRepository from 'Modules/Wallets/Repositories/IWalletsRepository';
import AppError from 'Shared/Errors/AppError';
import { inject, injectable } from 'tsyringe';
import Accumulation from '../Infra/TypeORM/Entities/Accumulation';
import IAccumulationsRepository from '../Repositories/IAccumulationsRepository';

@injectable()
class IndexAccumulationsService {
  constructor(
    @inject('WalletsRepository')
    private walletsRepository: IWalletsRepository,

    @inject('AccumulationsRepository')
    private accumulationsRepository: IAccumulationsRepository,
  ) {}

  public async execute({
    user_id,
    wallet_id,
  }: {
    user_id: string;
    wallet_id: string;
  }): Promise<Accumulation[]> {
    const wallet = await this.walletsRepository.findById(wallet_id);

    if (!wallet || wallet.user_id !== user_id) {
      throw new AppError('Accumulation plan not found!', 404);
    }

    return this.accumulationsRepository.findByWalletId(wallet_id);
  }
}

export default IndexAccumulationsService;
