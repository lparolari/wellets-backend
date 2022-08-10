import IAssetsRepository from 'Modules/Assets/Repositories/IAssetsRepository';
import AppError from 'Shared/Errors/AppError';
import { inject, injectable } from 'tsyringe';

import ICreateAccumulationDTO from '../DTOs/ICreateAccumulationDTO';
import Accumulation from '../Infra/TypeORM/Entities/Accumulation';
import IAccumulationsRepository from '../Repositories/IAccumulationsRepository';

type Request = ICreateAccumulationDTO & { user_id: string };

@injectable()
class CreateAccumulationService {
  constructor(
    @inject('AssetsRepository')
    private assetsRepository: IAssetsRepository,

    @inject('AccumulationsRepository')
    private accumulationsRepository: IAccumulationsRepository,
  ) {}

  public async execute(data: Request): Promise<Accumulation> {
    const asset = await this.assetsRepository.findById(data.asset_id);

    if (!asset || asset.user_id !== data.user_id) {
      throw new AppError('Asset not found!', 404);
    }

    return this.accumulationsRepository.create(data);
  }
}

export default CreateAccumulationService;
