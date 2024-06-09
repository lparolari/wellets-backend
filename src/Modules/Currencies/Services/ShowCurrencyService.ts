import { injectable, inject } from 'tsyringe';

import Currency from '../Infra/TypeORM/Entities/Currency';
import ICurrenciesRepository from '../Repositories/ICurrenciesRepository';

interface IRequest {
  currency_id: string;
}

@injectable()
class ShowCurrencyService {
  constructor(
    @inject('CurrenciesRepository')
    private currenciesRepository: ICurrenciesRepository,
  ) {}

  public async execute({
    currency_id,
  }: IRequest): Promise<Currency | undefined> {
    return this.currenciesRepository.findById(currency_id);
  }
}

export default ShowCurrencyService;
