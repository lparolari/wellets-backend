import { injectable, container } from 'tsyringe';

import ShowWalletBalance from 'Modules/Wallets/Services/ShowWalletBalance';
import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';
import ShowPortfolioService from './ShowPortfolioService';
import Portfolio from '../Infra/TypeORM/Entities/Portfolio';

interface IRequest {
  portfolio_id: string;
  target_currency: string;
  user_id: string;
}

interface IResponse {
  balance: number;
}

@injectable()
class ShowPortfolioBalanceService {
  public async execute({
    target_currency,
    portfolio_id,
    user_id,
  }: IRequest): Promise<IResponse> {
    const showPortfolio = container.resolve(ShowPortfolioService);
    const showWalletBalance = container.resolve(ShowWalletBalance);

    const getPortfolioWalletsBalance = async (
      wallets: Wallet[],
    ): Promise<number> => {
      let balance = 0;
      for (const wallet of wallets) {
        balance += (
          await showWalletBalance.execute({
            target_currency,
            wallet_id: wallet.id,
            user_id,
          })
        ).balance;
      }
      return balance;
    };

    const getChildrenPortfoliosBalance = async (
      portfolios: Portfolio[],
    ): Promise<number> => {
      let balance = 0;
      for (const child of portfolios) {
        balance += (
          await this.execute({
            target_currency,
            portfolio_id: child.id,
            user_id,
          })
        ).balance;
      }
      return balance;
    };

    const portfolio = await showPortfolio.execute({
      id: portfolio_id,
      user_id,
    });

    let balance = 0;
    balance += await getPortfolioWalletsBalance(portfolio.wallets);
    balance += await getChildrenPortfoliosBalance(portfolio.children);

    return { balance };
  }
}

export default ShowPortfolioBalanceService;
