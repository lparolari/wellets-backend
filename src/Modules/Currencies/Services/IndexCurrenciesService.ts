import { injectable, inject } from 'tsyringe';

import Currency from '../Infra/TypeORM/Entities/Currency';
import ICurrenciesRepository from '../Repositories/ICurrenciesRepository';

@injectable()
class IndexCurrenciesService {
  constructor(
    @inject('CurrenciesRepository')
    private currenciesRepository: ICurrenciesRepository,
  ) {}

  public async execute(user_id: string, sort_by?: string): Promise<Currency[]> {
    const params = {
      user_id,
      ...(sort_by && sort_by === 'favorite'
        ? { sort_by: 'favorite' as const }
        : {}),
    };

    return this.currenciesRepository.find(params);
  }
}

export default IndexCurrenciesService;
