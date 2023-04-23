import AppError from 'Shared/Errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IIntervalDTO } from '../DTOs/IIntervalDTO';
import IShowAssetHistoryServiceDTO from '../DTOs/IShowAssetHistoryServiceDTO';
import ITimeBalanceDTO from '../DTOs/ITimeBalanceDTO';

import IAssetsRepository from '../Repositories/IAssetsRepository';

@injectable()
class ShowAssetHistoryService {
  constructor(
    @inject('AssetsRepository')
    private assetsRepository: IAssetsRepository,
  ) {}

  public async execute({
    user_id,
    asset_id,
    interval,
    start,
    end,
  }: IShowAssetHistoryServiceDTO): Promise<ITimeBalanceDTO[]> {
    const intervals = ['1h', '1d', '1w', '1M', '1y'];

    if (!intervals.includes(interval)) {
      throw new AppError(
        `The given interval '${interval}' is invalid! Allowed values are: ${intervals}.`,
      );
    }

    const startDate = new Date(start);

    if (Number.isNaN(startDate.getTime())) {
      throw new AppError(`The given start date '${start}' is invalid!`);
    }

    const endDate = new Date(end);

    if (Number.isNaN(endDate.getTime())) {
      throw new AppError(`The given end date '${end}' is invalid!`);
    }

    const asset = await this.assetsRepository.findById(asset_id);

    if (!asset || asset.user_id !== user_id) {
      throw new AppError('Asset not found!');
    }

    return this.assetsRepository.history({
      asset_id: asset.id,
      interval: interval as IIntervalDTO,
      start: startDate,
      end: endDate,
    });
  }
}

export default ShowAssetHistoryService;
