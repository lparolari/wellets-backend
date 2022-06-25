import { injectable, container } from 'tsyringe';

import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';
import Portfolio from '../Infra/TypeORM/Entities/Portfolio';
import ShowPortfolioBalanceService from './ShowPortfolioBalanceService';
import IndexPortfoliosByParentIdService from './IndexPortfoliosByParentIdService';
import CollectRecursiveWalletsService from './CollectRecursiveWalletsService';

interface IRequest {
  currency_id: string;
  portfolio_id: string;
  user_id: string;
}

interface IResponse {
  changes: {
    portfolio: Portfolio;
    wallets: Wallet[];
    target: number;
    actual: number;
    off_by: number;
    action:
      | {
          type: 'sell' | 'buy';
          amount: number;
        }
      | {
          type: 'ok';
        };
  }[];
}

@injectable()
class ShowPortfolioCurrentAllocationService {
  public async execute({
    currency_id,
    portfolio_id,
    user_id,
  }: IRequest): Promise<IResponse> {
    const indexPortfoliosByParentId = container.resolve(
      IndexPortfoliosByParentIdService,
    );
    const showPortfolioBalance = container.resolve(ShowPortfolioBalanceService);
    const collectRecursiveWallets = container.resolve(
      CollectRecursiveWalletsService,
    );

    const portfolios = await indexPortfoliosByParentId.execute({
      parent_id: portfolio_id,
      user_id,
    });

    const getPortfoliosTotalBalance = async () => {
      let balances = [];
      for (const portfolio of portfolios) {
        const portfolioBalance = await showPortfolioBalance.execute({
          portfolio_id: portfolio.id,
          user_id,
          currency_id,
        });
        balances = [...balances, portfolioBalance.balance];
      }

      return balances.reduce((x, y) => x + y, 0);
    };

    const totalBalance = await getPortfoliosTotalBalance();
    let allocations = [];

    for (const portfolio of portfolios) {
      const { balance } = await showPortfolioBalance.execute({
        portfolio_id: portfolio.id,
        user_id,
        currency_id,
      });

      const off_by = balance / totalBalance - portfolio.weight;

      const wallets = await collectRecursiveWallets.execute({
        portfolio_id: portfolio.id,
        user_id,
      });

      const allocation = {
        portfolio,
        wallets,
        target: totalBalance * portfolio.weight,
        weight: balance / totalBalance,
        actual: balance,
        off_by,
        action: {
          type: off_by > 0 ? 'sell' : 'buy',
          amount: Math.abs(totalBalance * portfolio.weight - balance),
        },
      };

      allocations = [...allocations, allocation];
    }

    return {
      changes: allocations,
    };
  }
}

export default ShowPortfolioCurrentAllocationService;
