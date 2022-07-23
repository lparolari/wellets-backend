import IWalletsRepository from 'Modules/Wallets/Repositories/IWalletsRepository';
import AppError from 'Shared/Errors/AppError';
import { inject, injectable } from 'tsyringe';
import IDeleteAccumulationDTO from '../DTOs/IDeleteAccumulationDTO';
import Accumulation from '../Infra/TypeORM/Entities/Accumulation';
import IAccumulationsRepository from '../Repositories/IAccumulationsRepository';

type Request = IDeleteAccumulationDTO & { user_id: string };

@injectable()
class DeleteAccumulationService {
  constructor(
    @inject('WalletsRepository')
    private walletsRepository: IWalletsRepository,

    @inject('AccumulationsRepository')
    private accumulationsRepository: IAccumulationsRepository,
  ) {}

  public async execute({
    accumulation_id,
    user_id,
  }: Request): Promise<Accumulation> {
    const accumulation = await this.accumulationsRepository.findById(
      accumulation_id,
    );

    if (!accumulation) {
      throw new AppError('Accumulation not found!', 404);
    }

    const wallet = await this.walletsRepository.findById(
      accumulation.wallet_id,
    );

    if (!wallet || wallet.user_id !== user_id) {
      throw new AppError('Wallet not found!', 404);
    }

    return this.accumulationsRepository.delete(accumulation_id);
  }
}

export default DeleteAccumulationService;
