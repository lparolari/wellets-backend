import { container, injectable } from 'tsyringe';

import IAssetBalanceDTO from '../DTOs/IAssetBalanceDTO';
import IShowAssetBalanceDTO from '../DTOs/IShowAssetBalanceDTO';
import GetAssetBalanceService from './GetAssetBalanceService';

@injectable()
class ShowAssetBalanceService {
  public async execute({
    user_id,
  }: IShowAssetBalanceDTO): Promise<IAssetBalanceDTO> {
    const getAssetBalance = container.resolve(GetAssetBalanceService);

    const balance = await getAssetBalance.execute({ user_id });

    return { balance };
  }
}

export default ShowAssetBalanceService;
