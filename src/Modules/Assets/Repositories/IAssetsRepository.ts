import ICreateAssetDTO from '../DTOs/ICreateAssetDTO';
import IFindByUserIdDTO from '../DTOs/IFindByUserIdDTO';
import Asset from '../Infra/TypeORM/Entities/Asset';

interface IAssetsRepository {
  create(data: ICreateAssetDTO): Promise<Asset>;
  findByUserId(data: IFindByUserIdDTO): Promise<Asset[]>;
  findById(id: string): Promise<Asset | undefined>;
  save(asset: Asset): Promise<Asset>;
}

export default IAssetsRepository;
