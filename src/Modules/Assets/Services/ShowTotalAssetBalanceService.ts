import { container, injectable } from 'tsyringe';

import IAssetBalanceDTO from '../DTOs/IAssetBalanceDTO';
import IShowTotalAssetBalanceDTO from '../DTOs/IShowTotalAssetBalanceDTO';
import GetTotalAssetBalanceService from './GetTotalAssetBalanceService';

@injectable()
class ShowTotalAssetBalanceService {
  public async execute(
    data: IShowTotalAssetBalanceDTO,
  ): Promise<IAssetBalanceDTO> {
    const getTotalAssetBalance = container.resolve(GetTotalAssetBalanceService);
    const balance = await getTotalAssetBalance.execute(data);

    return { balance };
  }
}

export default ShowTotalAssetBalanceService;
