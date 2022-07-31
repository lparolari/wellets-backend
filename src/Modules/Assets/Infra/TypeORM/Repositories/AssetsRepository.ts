import ICreateAssetEntryDTO from 'Modules/Assets/DTOs/ICreateAssetEntryDTO';
import { EntityRepository, getRepository, Repository } from 'typeorm';

import IFindAssetByUserIdDTO from '../../../DTOs/IFindAssetByUserIdDTO';
import IFindAssetDTO from '../../../DTOs/IFindAssetDTO';
import IAssetsRepository from '../../../Repositories/IAssetsRepository';
import Asset from '../Entities/Asset';
import AssetEntry from '../Entities/AssetEntry';

@EntityRepository(Asset)
class AssetsRepository implements IAssetsRepository {
  private assetsRepository: Repository<Asset>;

  private entriesRepository: Repository<AssetEntry>;

  constructor() {
    this.assetsRepository = getRepository(Asset);
    this.entriesRepository = getRepository(AssetEntry);
  }

  public async find(where: IFindAssetDTO): Promise<Asset | undefined> {
    return this.assetsRepository.findOne({
      where,
      relations: ['entries'],
    });
  }

  public async findById(id: string): Promise<Asset | undefined> {
    return this.assetsRepository.findOne({
      where: { id },
      relations: ['entries'],
    });
  }

  public async findByUserId({
    user_id,
  }: IFindAssetByUserIdDTO): Promise<Asset[]> {
    return this.assetsRepository.find({
      where: { user_id },
      relations: ['entries'],
    });
  }

  public async getOrCreate(data: IFindAssetDTO): Promise<Asset> {
    const exists = await this.find({
      user_id: data.user_id,
      currency_id: data.currency_id,
    });

    if (!exists) {
      const asset = this.assetsRepository.create(data);
      const saved = await this.assetsRepository.save(asset);
      return saved;
    }

    return exists;
  }

  public async save(asset: Asset): Promise<Asset> {
    return this.assetsRepository.save(asset);
  }

  public async createEntry(data: ICreateAssetEntryDTO): Promise<Asset> {
    const entry = this.entriesRepository.create(data);
    await this.entriesRepository.save(entry);

    return this.findById(data.asset_id);
  }
}

export default AssetsRepository;
