import { injectable, container } from 'tsyringe';

import IFindByTransactionIdDTO from '../DTOs/IFindByTransactionIdDTO';
import Transaction from '../Infra/TypeORM/Entities/Transaction';
import ShowTransactionService from './ShowTransactionService';
import CreateTransactionService from './CreateTransactionService';

interface IRequest extends IFindByTransactionIdDTO {
  user_id: string;
  transaction_id: string;
}

@injectable()
class RevertTransactionService {
  public async execute({
    user_id,
    transaction_id,
  }: IRequest): Promise<Transaction | undefined> {
    const showTransaction = container.resolve(ShowTransactionService);
    const createTransaction = container.resolve(CreateTransactionService);
    const transaction = await showTransaction.execute({
      user_id,
      transaction_id,
    });

    const revertedTransaction = await createTransaction.execute({
      user_id,
      description: `Reverted ${transaction.description}`,
      value: transaction.value * -1,
      wallet_id: transaction.wallet_id,
      dollar_rate: transaction.dollar_rate,
      created_at: new Date(),
    });

    return showTransaction.execute({
      user_id,
      transaction_id: revertedTransaction.id,
    });
  }
}

export default RevertTransactionService;
