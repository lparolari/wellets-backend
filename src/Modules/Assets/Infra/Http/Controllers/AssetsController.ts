import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import IndexAssetsService from '../../../Services/IndexAssetsService';
import ShowAssetAllocationService from '../../../Services/ShowAssetAllocationService';

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

  public async allocation(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { id } = request.user;

    const showAssetAllocation = container.resolve(ShowAssetAllocationService);

    const allocation = await showAssetAllocation.execute({
      user_id: id,
    });

    return response.json(allocation);
  }
}

export default AssetsController;
