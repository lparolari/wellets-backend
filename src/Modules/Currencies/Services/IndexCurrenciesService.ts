import { injectable, inject } from 'tsyringe';

import Currency from '../Infra/TypeORM/Entities/Currency';
import ICurrenciesRepository from '../Repositories/ICurrenciesRepository';

@injectable()
class IndexCurrenciesService {
  constructor(
    @inject('CurrenciesRepository')
    private currenciesRepository: ICurrenciesRepository,
  ) {}

  public async execute(
    user_id?: string,
    sort_by?: string,
  ): Promise<Currency[]> {
    const options =
      sort_by && sort_by === 'favorite'
        ? { sort: { by: 'favorite' as const, params: { user_id } } }
        : undefined;

    return this.currenciesRepository.find(options);
  }
}

export default IndexCurrenciesService;
