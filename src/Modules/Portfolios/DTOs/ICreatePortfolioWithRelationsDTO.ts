import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';

interface ICreatePortfolioWithRelationsDTO {
  alias: string;
  weight: number;
  user_id: string;
  wallet_ids: string[];
  parent_id: string;
  wallets: Wallet[];
}

export default ICreatePortfolioWithRelationsDTO;
