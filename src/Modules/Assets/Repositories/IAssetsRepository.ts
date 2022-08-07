import ICreateAssetEntryDTO from '../DTOs/ICreateAssetEntryDTO';
import IFindAssetByUserIdDTO from '../DTOs/IFindAssetByUserIdDTO';
import IFindAssetDTO from '../DTOs/IFindAssetDTO';
import Asset from '../Infra/TypeORM/Entities/Asset';
import AssetEntry from '../Infra/TypeORM/Entities/AssetEntry';

interface IAssetsRepository {
  find(where: IFindAssetDTO): Promise<Asset | undefined>;
  findById(id: string): Promise<Asset | undefined>;
  findByUserId(data: IFindAssetByUserIdDTO): Promise<Asset[]>;
  getOrCreate(data: IFindAssetDTO): Promise<Asset>;
  save(asset: Asset): Promise<Asset>;
  createEntry(data: ICreateAssetEntryDTO): Promise<Asset>;
  findEntriesByAssetId(asset_id: string): Promise<AssetEntry[]>;
}

export default IAssetsRepository;
