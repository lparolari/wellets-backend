import { container, injectable } from 'tsyringe';

import IAssetBalanceDTO from '../DTOs/IAssetBalanceDTO';
import IShowAssetBalanceDTO from '../DTOs/IShowAssetBalanceDTO';
import GetAssetBalanceService from './GetAssetBalanceService';

@injectable()
class ShowAssetBalanceService {
  public async execute(data: IShowAssetBalanceDTO): Promise<IAssetBalanceDTO> {
    const getAssetBalance = container.resolve(GetAssetBalanceService);
    const balance = await getAssetBalance.execute(data);

    return { balance };
  }
}

export default ShowAssetBalanceService;
