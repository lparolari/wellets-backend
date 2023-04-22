import AppError from 'Shared/Errors/AppError';
import { inject, injectable } from 'tsyringe';
import ICreateAssetEntryDTO from '../DTOs/ICreateAssetEntryDTO';

import Asset from '../Infra/TypeORM/Entities/Asset';
import IAssetsRepository from '../Repositories/IAssetsRepository';

@injectable()
class CreateAssetEntryService {
  constructor(
    @inject('AssetsRepository')
    private assetsRepository: IAssetsRepository,
  ) {}

  public async execute({
    asset_id,
    transaction_id,
    value,
    dollar_rate,
    created_at,
  }: ICreateAssetEntryDTO): Promise<Asset> {
    const asset = await this.assetsRepository.findById(asset_id);

    if (!asset) {
      throw new AppError('Asset not found!', 404);
    }

    return this.assetsRepository.createEntry({
      asset_id,
      transaction_id,
      value,
      dollar_rate,
      created_at,
    });
  }
}

export default CreateAssetEntryService;
