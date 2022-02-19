import { injectable, inject } from 'tsyringe';

import log from 'Shared/Helpers/log';

import IWalletBalancesRepository from '../Repositories/IWalletBalancesRepository';

@injectable()
class BalanceSnapshotService {
  constructor(
    @inject('WalletBalancesRepository')
    private balancesRepository: IWalletBalancesRepository,
  ) {}

  public async execute(): Promise<void> {
    try {
      this.balancesRepository.snapshot();
      log('[BalanceSnapshotService] Balances shapshot done', 'blue');
    } catch (error) {
      log(`[BalanceSnapshotService] ${error.message}`, 'red');
    }
  }
}

export default BalanceSnapshotService;
