import ICreateAssetEntryDTO from '../DTOs/ICreateAssetEntryDTO';
import IFindAssetByUserIdDTO from '../DTOs/IFindAssetByUserIdDTO';
import IFindAssetDTO from '../DTOs/IFindAssetDTO';
import Asset from '../Infra/TypeORM/Entities/Asset';

interface IAssetsRepository {
  find(where: IFindAssetDTO): Promise<Asset | undefined>;
  findById(id: string): Promise<Asset | undefined>;
  findByUserId(data: IFindAssetByUserIdDTO): Promise<Asset[]>;
  getOrCreate(data: IFindAssetDTO): Promise<Asset>;
  save(asset: Asset): Promise<Asset>;
  createEntry(data: ICreateAssetEntryDTO): Promise<Asset>;
}

export default IAssetsRepository;
