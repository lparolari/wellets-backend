import { injectable, inject } from 'tsyringe';

import IWalletsRepository from 'Modules/Wallets/Repositories/IWalletsRepository';
import AppError from 'Shared/Errors/AppError';
import ICacheProvider from 'Shared/Containers/CacheProvider/Models/ICacheProvider';
import Transaction from '../Infra/TypeORM/Entities/Transaction';
import ICreateTransactionDTO from '../DTOs/ICreateTransactionDTO';
import ITransactionsRepository from '../Repositories/ITransactionsRepository';

interface IRequest extends ICreateTransactionDTO {
  user_id: string;
}

@injectable()
class CreateTransactionService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,

    @inject('WalletsRepository')
    private walletsRepository: IWalletsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    wallet_id,
    description,
    value,
    user_id,
    dollar_rate,
    created_at,
  }: IRequest): Promise<Transaction> {
    const wallet = await this.walletsRepository.findById(wallet_id, true);

    if (!wallet) {
      throw new AppError('This wallet does not exist!', 404);
    }

    if (wallet.user_id !== user_id) {
      throw new AppError('You are not the owner of this wallet!', 403);
    }

    if (dollar_rate === 0) {
      throw new AppError(
        'You cannot create a transaction with zero dollar rate!',
        400,
      );
    }

    const transaction = await this.transactionsRepository.create({
      description,
      value,
      wallet_id,
      dollar_rate: dollar_rate ?? wallet.currency.dollar_rate,
      created_at,
    });

    Object.assign(wallet, { balance: Number(wallet.balance) + value });
    await this.walletsRepository.save(wallet);

    this.cacheProvider.deleteByPrefix(`transactions:${wallet_id}`);
    this.cacheProvider.deleteByPrefix(`wallets:${user_id}`);

    return transaction;
  }
}

export default CreateTransactionService;
