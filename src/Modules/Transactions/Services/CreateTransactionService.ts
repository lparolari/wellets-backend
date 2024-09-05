import { injectable, inject, container } from 'tsyringe';

import IWalletsRepository from 'Modules/Wallets/Repositories/IWalletsRepository';
import AppError from 'Shared/Errors/AppError';
import ICacheProvider from 'Shared/Containers/CacheProvider/Models/ICacheProvider';
import IAccumulationsRepository from 'Modules/Accumulations/Repositories/IAccumulationsRepository';
import ShowAssetService from 'Modules/Assets/Services/ShowAssetService';
import UpdateAssetBalanceService from 'Modules/Assets/Services/UpdateAssetBalanceService';
import CreateAssetEntryService from 'Modules/Assets/Services/CreateAssetEntryService';
import Transaction from '../Infra/TypeORM/Entities/Transaction';
import ICreateTransactionDTO from '../DTOs/ICreateTransactionDTO';
import ITransactionsRepository from '../Repositories/ITransactionsRepository';

interface IRequest extends ICreateTransactionDTO {
  user_id: string;
  dollar_rate?: number;
}

@injectable()
class CreateTransactionService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,

    @inject('WalletsRepository')
    private walletsRepository: IWalletsRepository,

    @inject('AccumulationsRepository')
    private accumulationsRepository: IAccumulationsRepository,

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
    accumulation_id,
  }: IRequest): Promise<Transaction> {
    const showAsset = container.resolve(ShowAssetService);
    const updateAssetBalance = container.resolve(UpdateAssetBalanceService);
    const createAssetEntry = container.resolve(CreateAssetEntryService);

    const wallet = await this.walletsRepository.findById(wallet_id);

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
      created_at,
    });

    const asset = await showAsset.execute({
      user_id,
      currency_id: wallet.currency_id,
    });

    Object.assign(wallet, { balance: Number(wallet.balance) + value });
    await this.walletsRepository.save(wallet);

    await createAssetEntry.execute({
      asset_id: asset.id,
      value,
      dollar_rate: dollar_rate ?? wallet.currency.dollar_rate,
      transaction_id: transaction.id,
      created_at,
    });

    await updateAssetBalance.execute({
      asset_id: asset.id,
      value,
    });

    if (accumulation_id) {
      const accumulation = await this.accumulationsRepository.findById(
        accumulation_id,
      );

      if (!accumulation) {
        throw new AppError('This accumulation does not exist!', 404);
      }

      if (accumulation.asset_id !== asset.id) {
        throw new AppError(
          'This accumulation is not compatible with the currency of selected wallet!',
          400,
        );
      }

      await this.accumulationsRepository.createEntry({
        accumulation,
        transaction,
      });
    }

    this.cacheProvider.deleteByPrefix(`transactions:${wallet_id}`);
    this.cacheProvider.deleteByPrefix(`wallets:${user_id}`);

    return transaction;
  }
}

export default CreateTransactionService;
