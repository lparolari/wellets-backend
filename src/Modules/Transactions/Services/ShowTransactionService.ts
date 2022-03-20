import { injectable, inject } from 'tsyringe';

import AppError from 'Shared/Errors/AppError';
import ITransactionsRepository from '../Repositories/ITransactionsRepository';
import IFindByTransactionIdDTO from '../DTOs/IFindByTransactionIdDTO';
import Transaction from '../Infra/TypeORM/Entities/Transaction';

interface IRequest extends IFindByTransactionIdDTO {
  user_id: string;
  transaction_id: string;
}

@injectable()
class ShowTransactionService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,
  ) {}

  public async execute({
    user_id,
    transaction_id,
  }: IRequest): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findById(
      { transaction_id },
      true,
    );

    if (!transaction || transaction.wallet.user_id !== user_id) {
      throw new AppError('This transaction does not exists!', 404);
    }

    return transaction;
  }
}

export default ShowTransactionService;
