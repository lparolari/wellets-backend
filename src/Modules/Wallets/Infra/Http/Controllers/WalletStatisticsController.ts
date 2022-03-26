import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import EstimateAverageLoadPriceService from 'Modules/Wallets/Services/EstimateAverageLoadPriceService';

// TODO: rename in wallet statistics controller
class WalletStatisticsController {
  public async exposure(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { id } = request.user;
    const { wallet_id } = request.params;
    const { currency_id } = request.query;

    const estiamteAverageLoadPrice = container.resolve(
      EstimateAverageLoadPriceService,
    );

    const averageLoadPrice = await estiamteAverageLoadPrice.execute({
      user_id: id,
      wallet_id,
      currency_id: currency_id?.toString(),
    });

    return response.json({ averageLoadPrice });
  }
}

export default WalletStatisticsController;
