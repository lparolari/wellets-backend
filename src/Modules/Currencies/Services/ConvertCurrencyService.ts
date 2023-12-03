import { injectable, inject } from 'tsyringe';

import ICurrenciesRepository from '../Repositories/ICurrenciesRepository';

type ConvertCurrencyRequest = {
  from: string;
  to: string;
  amount?: number;
};

@injectable()
class ConvertCurrencyService {
  constructor(
    @inject('CurrenciesRepository')
    private currenciesRepository: ICurrenciesRepository,
  ) {}

  public async execute({
    from,
    to,
    amount = 0,
  }: ConvertCurrencyRequest): Promise<number> {
    const from_currency = await this.currenciesRepository.findByAcronym(from);

    if (!from_currency) {
      throw new Error('From currency not found!');
    }

    const to_currency = await this.currenciesRepository.findByAcronym(to);

    if (!to_currency) {
      throw new Error('To currency not found!');
    }

    const from_dollar_rate = from_currency.dollar_rate;
    const to_dollar_rate = to_currency.dollar_rate;

    return amount * (to_dollar_rate / from_dollar_rate);
  }
}

export default ConvertCurrencyService;
