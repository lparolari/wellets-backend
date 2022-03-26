import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import EstimateAverageLoadPriceService from 'Modules/Wallets/Services/EstimateAverageLoadPriceService';

// TODO: rename in wallet statistics controller
class WalletExposureController {
  public async exposure(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { id } = request.user;
    const { wallet_id, currency_id } = request.params;

    const estiamteAverageLoadPrice = container.resolve(
      EstimateAverageLoadPriceService,
    );

    const averageLoadPrice = await estiamteAverageLoadPrice.execute({
      user_id: id,
      wallet_id,
      currency_id,
    });

    return response.json({ averageLoadPrice });
  }
}

export default WalletExposureController;
