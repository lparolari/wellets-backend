import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import IndexAssetsService from '../../../Services/IndexAssetsService';

class AssetsController {
  public async index(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { id } = request.user;

    const indexAssets = container.resolve(IndexAssetsService);

    const assets = await indexAssets.execute({
      user_id: id,
    });

    return response.json(assets);
  }
}

export default AssetsController;
