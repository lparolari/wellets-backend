import IPaginatedTransactionsDTO from 'Modules/Transactions/DTOs/IPaginatedTransactionsDTO';
import Transaction from '../Infra/TypeORM/Entities/Transaction';
import ICreateTransactionDTO from '../DTOs/ICreateTransactionDTO';
import IFindByWalletIdDTO from '../DTOs/IFindByWalletIdDTO';
import IFindByTransactionIdDTO from '../DTOs/IFindByTransactionIdDTO';

interface ITransactionsRepository {
  create(data: ICreateTransactionDTO): Promise<Transaction>;
  save(transaction: Transaction): Promise<Transaction>;
  findById(
    data: IFindByTransactionIdDTO,
    complete?: boolean,
  ): Promise<Transaction | undefined>;
  findByWalletId(
    data: IFindByWalletIdDTO,
    complete?: boolean,
  ): Promise<IPaginatedTransactionsDTO>;
}

export default ITransactionsRepository;
