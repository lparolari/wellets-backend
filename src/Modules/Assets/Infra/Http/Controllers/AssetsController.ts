import { NextFunction, Request, Response } from 'express';
import ShowAverageLoadPriceService from 'Modules/Assets/Services/ShowAverageLoadPriceService';
import ShowTotalAssetBalanceService from 'Modules/Assets/Services/ShowTotalAssetBalanceService';
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
    const { asset_id } = request.query;

    const showAssetBalance = container.resolve(ShowAssetBalanceService);

    const balance = await showAssetBalance.execute({
      user_id: id,
      asset_id: asset_id.toString(),
    });

    return response.json(balance);
  }

  public async totalBalance(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { id } = request.user;

    const showTotalAssetBalance = container.resolve(
      ShowTotalAssetBalanceService,
    );

    const balance = await showTotalAssetBalance.execute({
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

  public async averageLoadPrice(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { id } = request.user;
    const { asset_id } = request.query;

    const showAverageLoadPrice = container.resolve(ShowAverageLoadPriceService);

    const averageLoadPrice = await showAverageLoadPrice.execute({
      user_id: id,
      asset_id: asset_id.toString(),
    });

    return response.json(averageLoadPrice);
  }
}

export default AssetsController;
