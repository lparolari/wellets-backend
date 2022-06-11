import { Request, Response, NextFunction } from 'express';
import GetUserPreferredCurrencyService from 'Modules/Users/Services/GetUserPreferredCurrencyService';
import { container } from 'tsyringe';

import EstimateTotalBalanceService from '../../../Services/EstimateTotalBalanceService';

class WalletsTotalBalanceController {
  public async show(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { id } = request.user;

    const estimateTotalBalance = container.resolve(EstimateTotalBalanceService);
    const showBaseCurrency = container.resolve(GetUserPreferredCurrencyService);

    const currency = await showBaseCurrency.execute({ user_id: id });

    const result = await estimateTotalBalance.execute({
      user_id: id,
      currency_id: currency.id,
    });

    return response.json({ ...result, currency });
  }
}

export default WalletsTotalBalanceController;
