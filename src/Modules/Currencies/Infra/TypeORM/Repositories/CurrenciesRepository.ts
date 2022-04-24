import { EntityRepository, Repository, getRepository } from 'typeorm';

import IFindParamsDTO from 'Modules/Currencies/DTOs/IFindParamsDTO';
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

  public async find(params: IFindParamsDTO): Promise<Currency[]> {
    let orderBy = {};

    orderBy = { 'currency.acronym': 'ASC' };

    if (params.sort_by === 'favorite') {
      orderBy = { favorite: 'DESC', 'currency.acronym': 'ASC' };
    }
    if (params.sort_by === 'acronym') {
      orderBy = { 'currency.acronym': 'ASC' };
    }

    const where = params.currency_id ? { id: params.currency_id } : {};

    return this.selectQuery(params.user_id)
      .orderBy(orderBy)
      .where(where)
      .getMany();
  }

  public async findById(id: string): Promise<Currency | undefined> {
    return this.selectQuery().where({ id }).getOne();
  }

  public async findByAcronym(acronym: string): Promise<Currency | undefined> {
    return this.selectQuery().where({ acronym }).getOne();
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
