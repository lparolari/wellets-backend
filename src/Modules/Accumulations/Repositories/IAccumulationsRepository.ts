import Accumulation from '../Infra/TypeORM/Entities/Accumulation';

interface IAccumulationsRepository {
  // create(data: ICreateCurrencyDTO): Promise<Currency>;
  // save(currency: Currency): Promise<Currency>;
  // find(): Promise<Accumulation[]>;
  findById(id: string): Promise<Accumulation | undefined>;
  // findByAcronym(acronym: string): Promise<Currency | undefined>;
  // delete(id: string): Promise<void>;
  findByWalletId(wallet_id: string): Promise<Accumulation[]>;
}

export default IAccumulationsRepository;
