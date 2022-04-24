import Currency from '../Infra/TypeORM/Entities/Currency';
import ICreateCurrencyDTO from '../DTOs/ICreateCurrencyDTO';
import IFindParamsDTO from '../DTOs/IFindParamsDTO';

interface ICurrenciesRepository {
  create(data: ICreateCurrencyDTO): Promise<Currency>;
  save(currency: Currency): Promise<Currency>;
  find(params: IFindParamsDTO): Promise<Currency[]>;
  findById(id: string): Promise<Currency | undefined>;
  findByAcronym(acronym: string): Promise<Currency | undefined>;
  delete(id: string): Promise<void>;
}

export default ICurrenciesRepository;
