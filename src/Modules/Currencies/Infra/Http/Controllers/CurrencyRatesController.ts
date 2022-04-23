import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';

import ShowCurrencyRate from 'Modules/Currencies/Services/ShowCurrencyRate';
import ICacheProvider from 'Shared/Containers/CacheProvider/Models/ICacheProvider';
import SyncCurrenciesService from 'Modules/Currencies/Services/SyncCurrenciesService';

class CurrencyRatesController {
  public async show(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { user } = request;
    const { base_currency, target_currency } = request.query;

    const id = user && user.id ? user.id : '';

    const showCurrencyRate = container.resolve(ShowCurrencyRate);

    const currencies = await showCurrencyRate.execute({
      base_currency: base_currency.toString(),
      target_currency: target_currency.toString(),
      user_id: id,
    });

    return response.json(currencies);
  }

  public async sync(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const cacheKey = `currencies:sync`;
    const cacheProvider = container.resolve<ICacheProvider>('CacheProvider');

    const lastSync = await cacheProvider.find<number>(cacheKey);

    if (!lastSync) {
      await cacheProvider.save(cacheKey, Date.now(), 60);

      const updateCurrencies = container.resolve(SyncCurrenciesService);

      await updateCurrencies.execute();

      return response.status(201).json();
    }

    return response.status(200).json();
  }
}

export default CurrencyRatesController;
