import { injectable, container } from 'tsyringe';

import Portfolio from '../Infra/TypeORM/Entities/Portfolio';

import ShowPortfolioService from './ShowPortfolioService';

interface IRequest {
  user_id: string;
  portfolio_id?: string;
}

@injectable()
class CollectRecursiveParentPotfoliosService {
  public async execute({
    user_id,
    portfolio_id,
  }: IRequest): Promise<Portfolio[]> {
    const showPortfolio = container.resolve(ShowPortfolioService);

    const collectRecursiveParentPortfolios = async (
      portfolio: Portfolio,
    ): Promise<Portfolio[]> => {
      if (!portfolio.parent) return [portfolio];

      const parent = await showPortfolio.execute({
        id: portfolio.parent.id,
        user_id,
      });

      const parents = await collectRecursiveParentPortfolios(parent);

      return [...parents, portfolio];
    };

    if (!portfolio_id) return [];

    const portfolio = await showPortfolio.execute({
      id: portfolio_id,
      user_id,
    });

    return collectRecursiveParentPortfolios(portfolio);
  }
}

export default CollectRecursiveParentPotfoliosService;
