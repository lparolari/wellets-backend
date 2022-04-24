import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import IndexCurrenciesService from 'Modules/Currencies/Services/IndexCurrenciesService';
import UpsertCurrencyPreferenceService from 'Modules/CurrencyPreferences/Services/UpsertCurrencyPreferenceService';

class CurrenciesController {
  public async index(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { user } = request;
    const { sort_by } = request.query;

    const indexCurrencies = container.resolve(IndexCurrenciesService);

    const currencies = await indexCurrencies.execute(
      user.id,
      typeof sort_by === 'string' ? sort_by : undefined,
    );

    return response.json(currencies);
  }

  public async update(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { user } = request;
    const { id } = request.params;

    const { favorite } = request.body;

    const upsertCurrencyPreferenceService = container.resolve(
      UpsertCurrencyPreferenceService,
    );

    const currencyPreference = await upsertCurrencyPreferenceService.execute({
      user_id: user.id,
      currency_id: id,
      favorite,
    });

    return response.json(currencyPreference);
  }
}

export default CurrenciesController;
