import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import IndexCurrenciesService from 'Modules/Currencies/Services/IndexCurrenciesService';
import ShowCurrencyKLinesService from 'Modules/Currencies/Services/ShowCurrencyKLinesService';

class CurrenciesController {
  public async index(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const indexCurrencies = container.resolve(IndexCurrenciesService);

    const currencies = await indexCurrencies.execute();

    return response.json(currencies);
  }

  public async klines(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
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
