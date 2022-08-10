import { injectable, inject, container } from 'tsyringe';

import ICacheProvider from 'Shared/Containers/CacheProvider/Models/ICacheProvider';
import Transaction from '../Infra/TypeORM/Entities/Transaction';
import ITransactionsRepository from '../Repositories/ITransactionsRepository';
import IUpdateTransactionDTO from '../DTOs/IUpdateTransactionDTO';
import ShowTransactionService from './ShowTransactionService';

interface IRequest extends IUpdateTransactionDTO {
  user_id: string;
}

@injectable()
class UpdateTransactionService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    transaction_id,
    user_id,
    description,
    value,
    dollar_rate,
    created_at,
  }: IRequest): Promise<Transaction> {
    const showTransaction = container.resolve(ShowTransactionService);

    // TODO: FIXME

    const transaction = await showTransaction.execute({
      user_id,
      transaction_id,
    });

    Object.assign(transaction, { description, value, dollar_rate, created_at });
    await this.transactionsRepository.save(transaction);

    this.cacheProvider.deleteByPrefix(`transactions:${transaction.wallet_id}`);
    this.cacheProvider.deleteByPrefix(`wallets:${user_id}`);

    return transaction;
  }
}

export default UpdateTransactionService;
