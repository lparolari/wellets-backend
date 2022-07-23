import ICreateAccumulationDTO from '../DTOs/ICreateAccumulationDTO';
import ICreateAccumulationEntryDTO from '../DTOs/ICreateAccumulationEntryDTO';
import Accumulation from '../Infra/TypeORM/Entities/Accumulation';

interface IAccumulationsRepository {
  // create(data: ICreateCurrencyDTO): Promise<Currency>;
  // save(currency: Currency): Promise<Currency>;
  // find(): Promise<Accumulation[]>;
  findById(id: string): Promise<Accumulation | undefined>;
  // findByAcronym(acronym: string): Promise<Currency | undefined>;
  delete(id: string): Promise<Accumulation>;
  findByWalletId(wallet_id: string): Promise<Accumulation[]>;
  create(data: ICreateAccumulationDTO): Promise<Accumulation>;
  createEntry(data: ICreateAccumulationEntryDTO): Promise<Accumulation>;
}

export default IAccumulationsRepository;
