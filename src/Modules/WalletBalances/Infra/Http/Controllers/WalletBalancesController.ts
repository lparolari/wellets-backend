import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import ShowHistoryService from 'Modules/WalletBalances/Services/ShowHistoryService';

class WalletBalancesController {
  public async history(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { user } = request;

    const { wallet_id, interval, start, end } = request.query;

    const showHistoryService = container.resolve(ShowHistoryService);

    const history = await showHistoryService.execute({
      user_id: user.id,
      wallet_id: wallet_id as string,
      interval: interval as string,
      start: start as string,
      end: end as string,
    });

    return response.json(history);
  }
}

export default WalletBalancesController;
