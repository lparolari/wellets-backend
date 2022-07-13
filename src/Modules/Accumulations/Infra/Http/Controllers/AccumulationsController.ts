import { Request, Response, NextFunction } from 'express';
import IndexAccumulationsService from 'Modules/Accumulations/Services/IndexAccumulationsService';
import { container } from 'tsyringe';

class AccumulationsController {
  public async index(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const indexAccumulations = container.resolve(IndexAccumulationsService);

    const { id: user_id } = request.user;
    const { portfolio_id } = request.params;

    return response.json(
      await indexAccumulations.execute({ portfolio_id, user_id }),
    );
  }
}

export default AccumulationsController;
