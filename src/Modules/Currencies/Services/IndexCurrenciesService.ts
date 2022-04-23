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
    const sortByFavorite = sort_by ? sort_by === 'favorite' : false;

    return this.currenciesRepository.find(user_id, sortByFavorite);
  }
}

export default IndexCurrenciesService;
