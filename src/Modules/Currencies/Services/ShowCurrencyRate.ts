import AppError from 'Shared/Errors/AppError';
import { injectable, inject } from 'tsyringe';

import ICurrenciesRepository from '../Repositories/ICurrenciesRepository';

interface IRequest {
  user_id?: string;
  base_currency: string;
  target_currency: string;
}

interface IResponse {
  rate: number;
  description: string;
}

@injectable()
class ShowCurrencyRate {
  constructor(
    @inject('CurrenciesRepository')
    private currenciesRepository: ICurrenciesRepository,
  ) {}

  public async execute({
    base_currency,
    target_currency,
    user_id,
  }: IRequest): Promise<IResponse> {
    const baseCurrency = await this.currenciesRepository.findByAcronym(
      base_currency,
    );
    const targetCurrency = await this.currenciesRepository.findByAcronym(
      target_currency,
    );
    if (!baseCurrency || !targetCurrency) {
      throw new AppError('Currency not found!', 404);
    }

    const rate = targetCurrency.dollar_rate / baseCurrency.dollar_rate;
    const description = `1 ${baseCurrency.acronym} = ${rate} ${targetCurrency.acronym}`;

    return {
      rate,
      description,
    };
  }
}

export default ShowCurrencyRate;
