import { injectable, inject, container } from 'tsyringe';

import Currency from 'Modules/Currencies/Infra/TypeORM/Entities/Currency';
import GetUserPreferredCurrencyService from 'Modules/Users/Services/GetUserPreferredCurrencyService';

import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';
import Portfolio from '../Infra/TypeORM/Entities/Portfolio';
import IPortfoliosRepository from '../Repositories/IPortfoliosRepository';
import ShowPortfolioBalanceService from './ShowPortfolioBalanceService';
import IndexPortfoliosByParentIdService from './IndexPortfoliosByParentIdService';
import CollectRecursiveWalletsService from './CollectRecursiveWalletsService';

interface IRequest {
  target_currency: string;
  portfolio_id: string;
  user_id: string;
}

interface IResponse {
  base_currency: Currency;
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
  constructor(
    @inject('PortfoliosRepository')
    private portfoliosRepository: IPortfoliosRepository,
  ) {}

  public async execute({
    target_currency,
    portfolio_id,
    user_id,
  }: IRequest): Promise<IResponse> {
    const indexPortfoliosByParentId = container.resolve(
      IndexPortfoliosByParentIdService,
    );
    const showPortfolioBalance = container.resolve(ShowPortfolioBalanceService);
    const getUserPreferredCurrency = container.resolve(
      GetUserPreferredCurrencyService,
    );
    const collectRecursiveWallets = container.resolve(
      CollectRecursiveWalletsService,
    );

    const base_currency = await getUserPreferredCurrency.execute({ user_id }); // TODO

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
          target_currency: base_currency.acronym, // TODO
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
        target_currency: base_currency.acronym, // TODO
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
      base_currency,
      changes: allocations,
    };
  }
}

export default ShowPortfolioCurrentAllocationService;
