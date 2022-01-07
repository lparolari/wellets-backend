import Portfolio from '../Infra/TypeORM/Entities/Portfolio';

import ICreatePortfolioWithRelationsDTO from '../DTOs/ICreatePortfolioWithRelationsDTO';

interface IWalletsRepository {
  create(data: ICreatePortfolioWithRelationsDTO): Promise<Portfolio>;
  find(user_id?: string, parent_id?: string): Promise<Portfolio[]>;
  findById(id: string): Promise<Portfolio | undefined>;
  findByUserIdAndAlias(
    user_id: string,
    alias: string,
  ): Promise<Portfolio | undefined>;
  save(portfolio: Portfolio): Promise<Portfolio>;
  delete(id: string): Promise<void>;
}

export default IWalletsRepository;
