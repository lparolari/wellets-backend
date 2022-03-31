import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';
import Portfolio from '../Infra/TypeORM/Entities/Portfolio';

import ICreatePortfolioWithRelationsDTO from '../DTOs/ICreatePortfolioWithRelationsDTO';

export type IUpdatePortfolioDTO = {
  alias: string;
  weight: number;
  user_id: string;
  wallets: Wallet[];
  parent?: Portfolio;
};

interface IWalletsRepository {
  create(data: ICreatePortfolioWithRelationsDTO): Promise<Portfolio>;
  find(user_id?: string, parent_id?: string): Promise<Portfolio[]>;
  findById(id: string): Promise<Portfolio | undefined>;
  findByUserId(user_id: string): Promise<Portfolio[]>;
  findByUserIdAndAlias(
    user_id: string,
    alias: string,
  ): Promise<Portfolio | undefined>;
  update(id: string, data: IUpdatePortfolioDTO): Promise<Portfolio>;
  delete(id: string): Promise<void>;
  save(portfolio: Portfolio): Promise<Portfolio>;
}

export default IWalletsRepository;
