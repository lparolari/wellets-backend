import Portfolio from '../Infra/TypeORM/Entities/Portfolio';

import ICreatePortfolioWithRelationsDTO from '../DTOs/ICreatePortfolioWithRelationsDTO';
import IUpdatePortfolioWithRelationsDTO from '../DTOs/IUpdatePortfolioWithRelationsDTO';

interface IWalletsRepository {
  create(data: ICreatePortfolioWithRelationsDTO): Promise<Portfolio>;
  find(user_id?: string, parent_id?: string): Promise<Portfolio[]>;
  findById(id: string): Promise<Portfolio | undefined>;
  findByUserId(user_id: string): Promise<Portfolio[]>;
  findByUserIdAndAlias(
    user_id: string,
    alias: string,
  ): Promise<Portfolio | undefined>;
  update(
    id: string,
    data: IUpdatePortfolioWithRelationsDTO,
  ): Promise<Portfolio>;
  delete(id: string): Promise<void>;
  save(portfolio: Portfolio): Promise<Portfolio>;
}

export default IWalletsRepository;
