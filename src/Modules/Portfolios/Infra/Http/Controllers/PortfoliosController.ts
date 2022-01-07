import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import IndexPortfoliosByParentIdService from 'Modules/Portfolios/Services/IndexPortfoliosByParentIdService';
import CreatePortfolioService from 'Modules/Portfolios/Services/CreatePortfolioService';
import DeletePortfolioService from 'Modules/Portfolios/Services/DeletePortfolioService';
import IndexAllPortfoliosService from 'Modules/Portfolios/Services/IndexAllPortfoliosService';

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

  public async indexAll(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { id } = request.user;

    const indexAll = container.resolve(IndexAllPortfoliosService);

    const portfolios = await indexAll.execute({
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

  public async delete(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { user } = request;

    const { portfolio_id } = request.params;

    const deletePortfolio = container.resolve(DeletePortfolioService);

    const portfolio = await deletePortfolio.execute({
      user_id: user.id,
      portfolio_id,
    });

    return response.status(204).json(portfolio);
  }
}

export default PortfoliosController;
