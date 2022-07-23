import IWalletsRepository from 'Modules/Wallets/Repositories/IWalletsRepository';
import AppError from 'Shared/Errors/AppError';
import { inject, injectable } from 'tsyringe';
import ICreateAccumulationDTO from '../DTOs/ICreateAccumulationDTO';
import Accumulation from '../Infra/TypeORM/Entities/Accumulation';
import IAccumulationsRepository from '../Repositories/IAccumulationsRepository';

type Request = ICreateAccumulationDTO & { user_id: string };

@injectable()
class CreateAccumulationService {
  constructor(
    @inject('WalletsRepository')
    private walletsRepository: IWalletsRepository,

    @inject('AccumulationsRepository')
    private accumulationsRepository: IAccumulationsRepository,
  ) {}

  public async execute(data: Request): Promise<Accumulation> {
    const wallet = await this.walletsRepository.findById(data.wallet_id);

    if (!wallet || wallet.user_id !== data.user_id) {
      throw new AppError('Wallet not found!', 404);
    }

    return this.accumulationsRepository.create(data);
  }
}

export default CreateAccumulationService;
