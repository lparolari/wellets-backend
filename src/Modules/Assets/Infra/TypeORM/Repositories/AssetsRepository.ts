import ICreateAssetDTO from 'Modules/Assets/DTOs/ICreateAssetDTO';
import IFindByUserIdDTO from 'Modules/Assets/DTOs/IFindByUserIdDTO';
import { EntityRepository, getRepository, Repository } from 'typeorm';

import IAssetsRepository from '../../../Repositories/IAssetsRepository';
import Asset from '../Entities/Asset';

@EntityRepository(Asset)
class AssetsRepository implements IAssetsRepository {
  private ormRepository: Repository<Asset>;

  constructor() {
    this.ormRepository = getRepository(Asset);
  }

  public async findById(id: string): Promise<Asset> {
    return this.ormRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async findByUserId({ user_id }: IFindByUserIdDTO): Promise<Asset[]> {
    return this.ormRepository.find({
      where: {
        user_id,
      },
    });
  }

  public async create(data: ICreateAssetDTO): Promise<Asset> {
    const asset = this.ormRepository.create(data);
    const saved = this.ormRepository.save(asset);
    return saved;
  }

  public async save(asset: Asset): Promise<Asset> {
    await this.ormRepository.save(asset);

    return asset;
  }
}

export default AssetsRepository;
