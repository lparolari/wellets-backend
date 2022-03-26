import { EntityRepository, Repository, getRepository } from 'typeorm';

import ITransactionsRepository from 'Modules/Transactions/Repositories/ITransactionsRepository';
import ICreateTransactionDTO from 'Modules/Transactions/DTOs/ICreateTransactionDTO';
import IFindByWalletIdDTO from 'Modules/Transactions/DTOs/IFindByWalletIdDTO';
import IPaginatedTransactionsDTO from 'Modules/Transactions/DTOs/IPaginatedTransactionsDTO';
import IFindByTransactionIdDTO from 'Modules/Transactions/DTOs/IFindByTransactionIdDTO';
import Transaction from '../Entities/Transaction';

@EntityRepository(Transaction)
class TransactionsRepository implements ITransactionsRepository {
  private ormRepository: Repository<Transaction>;

  constructor() {
    this.ormRepository = getRepository(Transaction);
  }

  public async create(data: ICreateTransactionDTO): Promise<Transaction> {
    const transaction = this.ormRepository.create(data);

    await this.ormRepository.save(transaction);

    return transaction;
  }

  public async findById(
    { transaction_id }: IFindByTransactionIdDTO,
    complete?: boolean,
  ): Promise<Transaction | undefined> {
    return this.ormRepository.findOne({
      where: {
        id: transaction_id,
      },
      relations: complete ? ['wallet', 'wallet.currency'] : [],
    });
  }

  public async findByWalletId(
    { wallet_id, limit, page }: IFindByWalletIdDTO,
    complete?: boolean,
  ): Promise<IPaginatedTransactionsDTO> {
    const result = await this.ormRepository.findAndCount({
      where: {
        wallet_id,
      },
      take: limit,
      skip: (page - 1) * limit,
      order: {
        created_at: 'DESC',
      },
      relations: complete ? ['wallet', 'wallet.currency'] : [],
    });

    return {
      transactions: result[0],
      total: result[1],
    };
  }

  public async save(transaction: Transaction): Promise<Transaction> {
    await this.ormRepository.save(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
