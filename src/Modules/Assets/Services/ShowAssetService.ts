import { inject, injectable } from 'tsyringe';

import IFindAssetDTO from '../DTOs/IFindAssetDTO';
import Asset from '../Infra/TypeORM/Entities/Asset';
import IAssetsRepository from '../Repositories/IAssetsRepository';

@injectable()
class ShowAssetService {
  constructor(
    @inject('AssetsRepository')
    private assetsRepository: IAssetsRepository,
  ) {}

  public async execute({
    user_id,
    currency_id,
  }: IFindAssetDTO): Promise<Asset> {
    return this.assetsRepository.getOrCreate({
      user_id,
      currency_id,
    });
  }
}

export default ShowAssetService;
