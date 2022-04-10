import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';
import { injectable, container } from 'tsyringe';
import Portfolio from '../Infra/TypeORM/Entities/Portfolio';

import ShowPortfolioService from './ShowPortfolioService';

interface IRequest {
  portfolio_id: string;
  user_id: string;
}

@injectable()
class CollectRecursiveWalletsService {
  public async execute({ portfolio_id, user_id }: IRequest): Promise<Wallet[]> {
    const showPortfolio = container.resolve(ShowPortfolioService);

    const collectRecursiveWallets = async (portfolio: Portfolio) => {
      let { wallets } = portfolio;

      for (const child of portfolio.children) {
        const p = await showPortfolio.execute({
          id: child.id,
          user_id,
        });

        wallets = [...wallets, ...(await collectRecursiveWallets(p))];
      }

      return wallets;
    };

    const portfolio = await showPortfolio.execute({
      id: portfolio_id,
      user_id,
    });

    return collectRecursiveWallets(portfolio);
  }
}

export default CollectRecursiveWalletsService;
