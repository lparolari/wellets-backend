import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import IndexPortfoliosByParentIdService from 'Modules/Portfolios/Services/IndexPortfoliosByParentIdService';
import CreatePortfolioService from 'Modules/Portfolios/Services/CreatePortfolioService';

class PortfoliosController {
  public async index(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { id } = request.user;
    const { parent_id } = request.params;

    const indexPortfoliosByParentId = container.resolve(
      IndexPortfoliosByParentIdService,
    );

    const portfolios = await indexPortfoliosByParentId.execute({
      parent_id,
      user_id: id,
    });

    return response.json(portfolios);
  }

  public async create(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { id } = request.user;
    const { alias, weight, wallet_ids, parent_id } = request.body;

    const createPortfolio = container.resolve(CreatePortfolioService);

    const portfolio = await createPortfolio.execute({
      user_id: id,
      alias,
      weight,
      wallet_ids,
      parent_id,
    });

    return response.status(201).json(portfolio);
  }
}

export default PortfoliosController;
