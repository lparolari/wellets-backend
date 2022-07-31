import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';

import IndexAssetsService from '../../../Services/IndexAssetsService';
import ShowAssetAllocationService from '../../../Services/ShowAssetAllocationService';
import ShowAssetBalanceService from '../../../Services/ShowAssetBalanceService';

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

  public async balance(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { id } = request.user;

    const showAssetBalance = container.resolve(ShowAssetBalanceService);

    const balance = await showAssetBalance.execute({
      user_id: id,
    });

    return response.json(balance);
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
