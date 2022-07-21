import { Request, Response, NextFunction } from 'express';
import CreateAccumulationService from 'Modules/Accumulations/Services/CreateAccumulationService';
import IndexAccumulationsService from 'Modules/Accumulations/Services/IndexAccumulationsService';
import ShowNextEntryService from 'Modules/Accumulations/Services/ShowNextEntry';
import { container } from 'tsyringe';

class AccumulationsController {
  public async indexByWallet(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const indexAccumulations = container.resolve(IndexAccumulationsService);

    const { id: user_id } = request.user;
    const { wallet_id } = request.query;

    return response.json(
      await indexAccumulations.execute({
        user_id,
        wallet_id: wallet_id.toString(),
      }),
    );
  }

  public async nextEntry(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { id: user_id } = request.user;
    const { accumulation_id } = request.params;

    const showNextEntry = container.resolve(ShowNextEntryService);

    const nextEntry = await showNextEntry.execute({
      userId: user_id,
      accumulationId: accumulation_id,
    });

    return response.json(nextEntry);
  }

  public async create(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { id: user_id } = request.user;
    const {
      alias,
      strategy,
      quote,
      planned_entries,
      every,
      planned_start,
      planned_end,
      wallet_id,
    } = request.body;

    const createAccumulation = container.resolve(CreateAccumulationService);

    const accumulation = await createAccumulation.execute({
      user_id,
      alias,
      strategy,
      quote,
      planned_entries,
      every,
      planned_start,
      planned_end,
      wallet_id,
    });

    return response.json(accumulation);
  }
}

export default AccumulationsController;
