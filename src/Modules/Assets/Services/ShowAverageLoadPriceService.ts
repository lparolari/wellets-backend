import { container, injectable } from 'tsyringe';

import IAverageLoadPriceDTO from '../DTOs/IAverageLoadPriceDTO';
import IShowAverageLoadPriceDTO from '../DTOs/IShowAverageLoadPriceDTO';
import GetAverageLoadPriceService from './GetAverageLoadPriceService';

@injectable()
class ShowAverageLoadPriceService {
  public async execute(
    data: IShowAverageLoadPriceDTO,
  ): Promise<IAverageLoadPriceDTO> {
    const getAverageLoadPrice = container.resolve(GetAverageLoadPriceService);

    const average_load_price = await getAverageLoadPrice.execute(data);

    return { average_load_price };
  }
}

export default ShowAverageLoadPriceService;
