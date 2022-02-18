import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import ShowHistoryService from 'Modules/WalletBalances/Services/ShowHistoryService';

class WalletBalancesController {
  public async history(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    // const { user } = request;

    // const { wallet_id, interval, start, end } = request.query;

    const showHistoryService = container.resolve(ShowHistoryService);

    const history = await showHistoryService.execute({
      user_id: 'aa', // user.id,
      wallet_id: '123', // wallet_id as string,
      interval: '1d', // interval as string,
      start: '1', // start as string,
      end: '2', // end as string,
    });

    return response.json(history);
  }
}

export default WalletBalancesController;
