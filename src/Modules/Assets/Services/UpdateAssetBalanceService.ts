import AppError from 'Shared/Errors/AppError';
import { inject, injectable } from 'tsyringe';

import IUpdateAssetBalanceDTO from '../DTOs/IUpdateAssetBalanceDTO';
import Asset from '../Infra/TypeORM/Entities/Asset';
import IAssetsRepository from '../Repositories/IAssetsRepository';

@injectable()
class UpdateAssetBalanceService {
  constructor(
    @inject('AssetsRepository')
    private assetsRepository: IAssetsRepository,
  ) {}

  public async execute({
    asset_id,
    value,
  }: IUpdateAssetBalanceDTO): Promise<Asset> {
    const asset = await this.assetsRepository.findById(asset_id);

    if (!asset) {
      throw new AppError('Asset not found!', 404);
    }

    Object.assign(asset, { balance: asset.balance + value });

    return this.assetsRepository.save(asset);
  }
}

export default UpdateAssetBalanceService;
