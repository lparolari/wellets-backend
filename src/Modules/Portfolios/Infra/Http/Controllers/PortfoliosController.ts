import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import IndexPortfoliosByParentIdService from 'Modules/Portfolios/Services/IndexPortfoliosByParentIdService';

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
}

export default PortfoliosController;
