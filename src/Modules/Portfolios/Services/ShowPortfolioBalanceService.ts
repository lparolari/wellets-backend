import { injectable, container } from 'tsyringe';

import ShowWalletBalance from 'Modules/Wallets/Services/ShowWalletBalance';
import ShowPortfolioService from './ShowPortfolioService';

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

    const portfolio = await showPortfolio.execute({
      id: portfolio_id,
      user_id,
    });

    let balance = 0;

    for (const wallet of portfolio.wallets) {
      balance += (
        await showWalletBalance.execute({
          target_currency,
          wallet_id: wallet.id,
          user_id,
        })
      ).balance;
    }

    return { balance };
  }
}

export default ShowPortfolioBalanceService;
