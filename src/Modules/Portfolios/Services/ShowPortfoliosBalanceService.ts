import { injectable, container } from 'tsyringe';

import IndexPortfoliosByParentIdService from './IndexPortfoliosByParentIdService';
import ShowPortfolioBalanceService from './ShowPortfolioBalanceService';

interface IRequest {
  currency_id: string;
  user_id: string;
}

interface IResponse {
  balance: number;
}

@injectable()
class ShowPortfoliosBalanceService {
  public async execute({ currency_id, user_id }: IRequest): Promise<IResponse> {
    const showPortfolioBalance = container.resolve(ShowPortfolioBalanceService);
    const indexPortfoliosByParentId = container.resolve(
      IndexPortfoliosByParentIdService,
    );

    const portfolios = await indexPortfoliosByParentId.execute({
      user_id,
      parent_id: null,
    });

    let balance = 0;

    for (const portfolio of portfolios) {
      balance += (
        await showPortfolioBalance.execute({
          currency_id,
          portfolio_id: portfolio.id,
          user_id,
        })
      ).balance;
    }

    return { balance };
  }
}

export default ShowPortfoliosBalanceService;
