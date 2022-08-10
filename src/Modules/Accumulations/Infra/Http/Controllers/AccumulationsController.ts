import { Request, Response, NextFunction } from 'express';
import CreateAccumulationService from 'Modules/Accumulations/Services/CreateAccumulationService';
import DeleteAccumulationService from 'Modules/Accumulations/Services/DeleteAccumulationService';
import IndexAccumulationsService from 'Modules/Accumulations/Services/IndexAccumulationsService';
import ShowNextAccumulationEntryService from 'Modules/Accumulations/Services/ShowNextAccumulationEntryService';
import { container } from 'tsyringe';

class AccumulationsController {
  public async index(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const indexAccumulations = container.resolve(IndexAccumulationsService);

    const { id: user_id } = request.user;
    const { asset_id } = request.query;

    return response.json(
      await indexAccumulations.execute({
        user_id,
        asset_id: asset_id?.toString(),
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

    const showNextEntry = container.resolve(ShowNextAccumulationEntryService);

    const nextEntry = await showNextEntry.execute({
      user_id,
      accumulation_id,
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
      asset_id,
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
      asset_id,
    });

    return response.json(accumulation);
  }

  public async delete(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { id: user_id } = request.user;
    const { accumulation_id } = request.params;

    const deleteAccumulation = container.resolve(DeleteAccumulationService);

    const accumulation = await deleteAccumulation.execute({
      user_id,
      accumulation_id,
    });

    return response.status(200).json(accumulation);
  }
}

export default AccumulationsController;
