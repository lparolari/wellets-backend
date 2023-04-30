import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import IndexCurrenciesService from 'Modules/Currencies/Services/IndexCurrenciesService';
import UpsertCurrencyPreferenceService from 'Modules/CurrencyPreferences/Services/UpsertCurrencyPreferenceService';
import ShowCurrencyService from 'Modules/Currencies/Services/ShowCurrencyService';
import ShowCurrencyKLinesService from 'Modules/Currencies/Services/ShowCurrencyKLinesService';

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

    const showCurrency = container.resolve(ShowCurrencyService);
    const upsertCurrencyPreference = container.resolve(
      UpsertCurrencyPreferenceService,
    );

    const exists = await showCurrency.execute({
      currency_id: id,
      user_id: user.id,
    });

    if (!exists) {
      throw new Error('Currency not found!');
    }

    await upsertCurrencyPreference.execute({
      user_id: user.id,
      currency_id: id,
      favorite,
    });

    const currency = await showCurrency.execute({
      currency_id: id,
      user_id: user.id,
    });

    return response.json(currency);
  }

  public async klines(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    // const { user } = request;
    const { id } = request.params;

    const { interval, start_time, end_time, limit } = request.query;

    const showCurrencyKLines = container.resolve(ShowCurrencyKLinesService);

    const history = await showCurrencyKLines.execute({
      currency_id: id,
      interval: interval as string,
      start_time: new Date(start_time as string),
      end_time: new Date(end_time as string),
      limit: limit && Number(limit),
    });

    return response.json(history);
  }
}

export default CurrenciesController;
