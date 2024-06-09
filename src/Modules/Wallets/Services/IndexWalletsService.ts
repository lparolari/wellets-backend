import { inject, injectable } from 'tsyringe';

import ICacheProvider from 'Shared/Containers/CacheProvider/Models/ICacheProvider';
import IWalletsRepository from '../Repositories/IWalletsRepository';
import IFindResponseDTO from '../DTOs/IFindResponseDTO';
import IFindByUserIdDTO from '../DTOs/IFindByUserIdDTO';

@injectable()
class IndexWalletsService {
  constructor(
    @inject('WalletsRepository')
    private walletsRepository: IWalletsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    user_id,
    portfolio_id,
    ...rest
  }: IFindByUserIdDTO): Promise<IFindResponseDTO> {
    const cacheKey = `wallets:${user_id}:${portfolio_id}:${JSON.stringify(
      rest,
    )}`;

    let data = null; // await this.cacheProvider.find<IFindResponseDTO>(cacheKey);

    if (!data) {
      data = await this.walletsRepository.findByUserId({
        user_id,
        portfolio_id,
        ...rest,
      });

      this.cacheProvider.save<IFindResponseDTO>(cacheKey, data);
    }

    return data;
  }
}

export default IndexWalletsService;
