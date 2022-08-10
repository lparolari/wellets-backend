import IAssetsRepository from 'Modules/Assets/Repositories/IAssetsRepository';
import AppError from 'Shared/Errors/AppError';
import { inject, injectable } from 'tsyringe';

import IDeleteAccumulationDTO from '../DTOs/IDeleteAccumulationDTO';
import Accumulation from '../Infra/TypeORM/Entities/Accumulation';
import IAccumulationsRepository from '../Repositories/IAccumulationsRepository';

type Request = IDeleteAccumulationDTO & { user_id: string };

@injectable()
class DeleteAccumulationService {
  constructor(
    @inject('AssetsRepository')
    private assetsRepository: IAssetsRepository,

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

    const asset = await this.assetsRepository.findById(accumulation.asset_id);

    if (!asset || asset.user_id !== user_id) {
      throw new AppError('Asset not found!', 404);
    }

    return this.accumulationsRepository.delete(accumulation_id);
  }
}

export default DeleteAccumulationService;
