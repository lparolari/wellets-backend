import IWalletBalancesRepository from 'Modules/WalletBalances/Repositories/IWalletBalancesRepository';
import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';
import { EntityRepository, getRepository, Repository } from 'typeorm';

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
}

export default WalletBalancesRepository;
