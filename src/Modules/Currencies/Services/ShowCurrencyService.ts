import { injectable, inject } from 'tsyringe';

import Currency from '../Infra/TypeORM/Entities/Currency';
import ICurrenciesRepository from '../Repositories/ICurrenciesRepository';

@injectable()
class ShowCurrencyService {
  constructor(
    @inject('CurrenciesRepository')
    private currenciesRepository: ICurrenciesRepository,
  ) {}

  public async execute({
    currency_id,
    user_id,
  }: {
    currency_id: string;
    user_id: string;
  }): Promise<Currency | undefined> {
    const currencies = await this.currenciesRepository.find({
      user_id,
      currency_id,
    });

    if (currencies.length === 0) {
      return undefined;
    }

    return currencies[0];
  }
}

export default ShowCurrencyService;
