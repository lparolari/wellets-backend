import Currency from '../Infra/TypeORM/Entities/Currency';
import ICreateCurrencyDTO from '../DTOs/ICreateCurrencyDTO';
import IQueryOptionsDTO from '../DTOs/IQueryOptionsDTO';

interface ICurrenciesRepository {
  create(data: ICreateCurrencyDTO): Promise<Currency>;
  save(currency: Currency): Promise<Currency>;
  find(options: IQueryOptionsDTO): Promise<Currency[]>;
  findById(id: string): Promise<Currency | undefined>;
  findByAcronym(acronym: string): Promise<Currency | undefined>;
  delete(id: string): Promise<void>;
}

export default ICurrenciesRepository;
