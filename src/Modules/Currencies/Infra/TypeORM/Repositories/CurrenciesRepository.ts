import { EntityRepository, Repository, getRepository } from 'typeorm';

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

  public async find(): Promise<Currency[]> {
    return this.ormRepository.find({
      order: { acronym: 'ASC' },
    });
  }

  public async findById(id: string): Promise<Currency | undefined> {
    return this.ormRepository.findOne(id);
  }

  public async findByAcronym(acronym: string): Promise<Currency | undefined> {
    return this.ormRepository.findOne({ where: { acronym } });
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default CurrenciesRepository;
