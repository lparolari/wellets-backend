import {
  EntityRepository,
  Repository,
  getRepository,
  IsNull,
  FindConditions,
  OrderByCondition,
} from 'typeorm';

import Currency from '../Entities/Currency';
import ICreateCurrencyDTO from '../../../DTOs/ICreateCurrencyDTO';
import ICurrenciesRepository from '../../../Repositories/ICurrenciesRepository';

type Where = FindConditions<Currency>[] | FindConditions<Currency>;
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
    get_natives?: boolean,
    sort_by_favorite?: boolean,
  ): Promise<Currency[]> {
    let where = { user_id: IsNull() } as Where;

    const orderBy: OrderByCondition = {
      ...(sort_by_favorite ? { favorite: 'DESC' } : {}),
      'currency.acronym': 'ASC',
    };

    if (user_id) {
      where = get_natives ? [{ user_id }, { user_id: IsNull() }] : { user_id };
    }

    return this.selectQuery(user_id).where(where).orderBy(orderBy).getMany();
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
