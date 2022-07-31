import { inject, injectable } from 'tsyringe';

import IFindByUserIdDTO from '../DTOs/IFindByUserIdDTO';
import Asset from '../Infra/TypeORM/Entities/Asset';
import IAssetsRepository from '../Repositories/IAssetsRepository';

@injectable()
class IndexAssetsService {
  constructor(
    @inject('AssetsRepository')
    private assetsRepository: IAssetsRepository,
  ) {}

  public async execute({ user_id }: IFindByUserIdDTO): Promise<Asset[]> {
    return this.assetsRepository.findByUserId({
      user_id,
    });
  }
}

export default IndexAssetsService;
