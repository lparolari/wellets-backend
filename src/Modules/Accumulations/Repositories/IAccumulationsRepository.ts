import ICreateAccumulationDTO from '../DTOs/ICreateAccumulationDTO';
import ICreateAccumulationEntryDTO from '../DTOs/ICreateAccumulationEntryDTO';
import IFindAccumulationDTO from '../DTOs/IFindAccumulationDTO';
import Accumulation from '../Infra/TypeORM/Entities/Accumulation';

interface IAccumulationsRepository {
  create(data: ICreateAccumulationDTO): Promise<Accumulation>;
  createEntry(data: ICreateAccumulationEntryDTO): Promise<Accumulation>;
  find(where: IFindAccumulationDTO): Promise<Accumulation[]>;
  findById(id: string): Promise<Accumulation | undefined>;
  delete(id: string): Promise<Accumulation>;
}

export default IAccumulationsRepository;
