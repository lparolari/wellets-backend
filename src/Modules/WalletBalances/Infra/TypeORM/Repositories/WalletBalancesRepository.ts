import { IBalance } from 'Modules/WalletBalances/DTOs/IBalance';
import { IHistoryDTO } from 'Modules/WalletBalances/DTOs/IHistoryDTO';
import IWalletBalancesRepository from 'Modules/WalletBalances/Repositories/IWalletBalancesRepository';
import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';
import { toTimestamp } from 'Shared/Infra/TypeORM/utils';
import {
  EntityRepository,
  getRepository,
  LessThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

import WalletBalances from '../Entities/WalletBalance';

@EntityRepository(WalletBalances)
class WalletBalancesRepository implements IWalletBalancesRepository {
  private balancesRepository: Repository<WalletBalances>;

  private walletsRepository: Repository<Wallet>;

  constructor() {
    this.balancesRepository = getRepository(WalletBalances);
    this.walletsRepository = getRepository(Wallet);
  }

  public async snapshot(): Promise<void> {
    const wallets = await this.walletsRepository.find();

    const balances = wallets.map(wallet => {
      const balance = this.balancesRepository.create({
        wallet_id: wallet.id,
        balance: wallet.balance,
      });

      return balance;
    });

    await this.balancesRepository.save(balances);
  }

  public async history({
    wallet_id,
    start,
    end,
  }: IHistoryDTO): Promise<IBalance[]> {
    return this.balancesRepository
      .createQueryBuilder('balance')
      .where({ wallet_id })
      .andWhere(start ? { created_at: MoreThanOrEqual(start) } : {})
      .andWhere(end ? { created_at: LessThan(end) } : {})
      .groupBy('date(balance.created_at)')
      .select(toTimestamp('balance.created_at', 'timestamp'))
      .addSelect('avg(balance.balance)::real', 'balance')
      .orderBy('date(balance.created_at)', 'ASC')
      .getRawMany<IBalance>();
  }
}

export default WalletBalancesRepository;
