import Transaction from 'Modules/Transactions/Infra/TypeORM/Entities/Transaction';
import Accumulation from '../Infra/TypeORM/Entities/Accumulation';

interface ICreateAccumulationEntryDTO {
  accumulation: Accumulation;
  transaction: Transaction;
}

export default ICreateAccumulationEntryDTO;
