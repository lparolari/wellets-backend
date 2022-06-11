import { Request, Response, NextFunction } from 'express';
import GetUserPreferredCurrencyService from 'Modules/Users/Services/GetUserPreferredCurrencyService';
import { container } from 'tsyringe';

import ShowWalletBalance from '../../../Services/ShowWalletBalance';

class WalletBalancesController {
  public async show(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { wallet_id } = request.query;

    const { id } = request.user;

    const showWalletBalance = container.resolve(ShowWalletBalance);
    const showBaseCurrency = container.resolve(GetUserPreferredCurrencyService);

    const baseCurrency = await showBaseCurrency.execute({ user_id: id });

    const result = await showWalletBalance.execute({
      target_currency: baseCurrency.acronym,
      user_id: id,
      wallet_id: wallet_id.toString(),
    });

    return response.json(result);
  }
}

export default WalletBalancesController;
