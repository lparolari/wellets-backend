import {
  EntityRepository,
  Repository,
  getRepository,
  IsNull,
  OrderByCondition,
} from 'typeorm';

import Currency from '../Entities/Currency';
import ICreateCurrencyDTO from '../../../DTOs/ICreateCurrencyDTO';
import ICurrenciesRepository from '../../../Repositories/ICurrenciesRepository';

@EntityRepository(Currency)
class CurrenciesRepository implements ICurrenciesRepository {
  private ormRepository: Repository<Currency>;

  constructor() {
    this.ormRepository = getRepository(Currency);
  }

  public async create(data: ICreateCurrencyDTO): Promise<Currency> {
    const currency = this.ormRepository.create(data);

    await this.ormRepository.save(currency);

    return currency;
  }

  public async save(currency: Currency): Promise<Currency> {
    await this.ormRepository.save(currency);

    return currency;
  }

  public async findById(id: string): Promise<Currency | undefined> {
    return this.selectQuery().where({ id }).getOne();
  }

  public async find(
    user_id?: string,
    sort_by_favorite?: boolean,
  ): Promise<Currency[]> {
    const orderBy: OrderByCondition = {
      ...(sort_by_favorite ? { favorite: 'DESC' } : {}),
      'currency.acronym': 'ASC',
    };

    return this.selectQuery(user_id).orderBy(orderBy).getMany();
  }

  public async findByAcronym(
    acronym: string,
    user_id?: string,
  ): Promise<Currency | undefined> {
    const where = user_id
      ? [
          {
            acronym,
            user_id,
          },
          {
            acronym,
            user_id: IsNull(),
          },
        ]
      : {
          acronym,
          user_id: IsNull(),
        };

    return this.selectQuery().where(where).getOne();
  }

  public async findAllByAcronym(acronym: string): Promise<Currency[]> {
    return this.selectQuery().where({ acronym }).getMany();
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  private selectQuery(user_id?: string) {
    return this.ormRepository
      .createQueryBuilder('currency')
      .addSelect(
        'preference.favorite is not null and preference.favorite',
        'favorite',
      )
      .leftJoin(
        'currency.user_preferences',
        'preference',
        'currency.id = preference.currency_id AND preference.user_id = :user_id',
        { user_id },
      );
  }
}

export default CurrenciesRepository;
