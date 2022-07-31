import { EntityRepository, getRepository, Repository } from 'typeorm';

import IFindAssetByUserIdDTO from '../../../DTOs/IFindAssetByUserIdDTO';
import IFindAssetDTO from '../../../DTOs/IFindAssetDTO';
import IAssetsRepository from '../../../Repositories/IAssetsRepository';
import Asset from '../Entities/Asset';

@EntityRepository(Asset)
class AssetsRepository implements IAssetsRepository {
  private ormRepository: Repository<Asset>;

  constructor() {
    this.ormRepository = getRepository(Asset);
  }

  public async find(where: IFindAssetDTO): Promise<Asset | undefined> {
    return this.ormRepository.findOne({
      where,
    });
  }

  public async findById(id: string): Promise<Asset | undefined> {
    return this.ormRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async findByUserId({
    user_id,
  }: IFindAssetByUserIdDTO): Promise<Asset[]> {
    return this.ormRepository.find({
      where: {
        user_id,
      },
    });
  }

  public async getOrCreate(data: IFindAssetDTO): Promise<Asset> {
    const exists = await this.find({
      user_id: data.user_id,
      currency_id: data.currency_id,
    });

    if (!exists) {
      const asset = this.ormRepository.create(data);
      const saved = await this.ormRepository.save(asset);
      return saved;
    }

    return exists;
  }

  public async save(asset: Asset): Promise<Asset> {
    return this.ormRepository.save(asset);
  }
}

export default AssetsRepository;
