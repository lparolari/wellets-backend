import ICreateAssetEntryDTO from 'Modules/Assets/DTOs/ICreateAssetEntryDTO';
import IHistoryDTO from 'Modules/Assets/DTOs/IHistoryDTO';
import ITimeBalanceDTO from 'Modules/Assets/DTOs/ITimeBalanceDTO';
import {
  EntityRepository,
  getRepository,
  Repository,
  LessThan,
  MoreThanOrEqual,
  getManager,
} from 'typeorm';

import { toTimestamp } from 'Shared/Infra/TypeORM/utils';
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
      relations: ['entries', 'currency'],
    });
  }

  public async findById(id: string): Promise<Asset | undefined> {
    return this.assetsRepository.findOne({
      where: { id },
      relations: ['entries', 'currency'],
    });
  }

  public async findByUserId({
    user_id,
  }: IFindAssetByUserIdDTO): Promise<Asset[]> {
    return this.assetsRepository.find({
      where: { user_id },
      relations: ['entries', 'currency'],
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

  public async findEntriesByAssetId(asset_id: string): Promise<AssetEntry[]> {
    return this.entriesRepository.find({
      where: { asset_id },
    });
  }

  public async history({
    asset_id,
    start,
    end,
    interval,
  }: IHistoryDTO): Promise<ITimeBalanceDTO[]> {
    const groupExpression = {
      '1h': "date_trunc('hour', entry.created_at::timestamp)",
      '1d': "date_trunc('day', entry.created_at::timestamp)",
      '1w': "date_trunc('week', entry.created_at::timestamp)",
      '1M': "date_trunc('month', entry.created_at::timestamp)",
      '1y': "date_trunc('year', entry.created_at::timestamp)",
    }[interval];

    // computes the cumulative sum of entries, grouped by timestamp and entry's
    // value. it returns a row for each entry's value and group(timestamp), for this
    // reason we need to group by timestamp again in the outer query
    const groupByCum = this.entriesRepository
      .createQueryBuilder('entry')
      .select(toTimestamp(groupExpression, 'timestamp'))
      .addSelect(
        // computes the cumulative sum
        `coalesce(sum(entry.value) OVER (ORDER BY ${groupExpression}), 0)::real`,
        'balance',
      )
      .where('entry.asset_id = :asset_id')
      .groupBy(`${groupExpression}, entry.value`)
      .orderBy(groupExpression, 'ASC');

    // we can group by timestamp instead of groupExpression because
    // in the sub-query we already computed truncated timestamps
    const qb = getManager()
      .createQueryBuilder()
      .select('timestamp')
      .addSelect('max(balance)', 'balance') // sic!
      .from(`(${groupByCum.getQuery()})`, 'subquery')
      .andWhere(start ? { timestamp: MoreThanOrEqual(start) } : {})
      .andWhere(end ? { timestamp: LessThan(end) } : {})
      .groupBy('timestamp')
      .orderBy('timestamp', 'ASC')
      .setParameter('asset_id', asset_id);

    return qb.getRawMany<ITimeBalanceDTO>();
  }
}

export default AssetsRepository;
