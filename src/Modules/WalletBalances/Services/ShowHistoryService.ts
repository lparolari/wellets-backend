import ShowWalletService from 'Modules/Wallets/Services/ShowWalletService';
import { injectable, inject, container } from 'tsyringe';
import { IBalance } from '../DTOs/IBalance';

import IWalletBalancesRepository from '../Repositories/IWalletBalancesRepository';

interface X {
  user_id: string;
  wallet_id: string;
  interval: string;
  start: string;
  end: string;
}

@injectable()
class ShowHistoryService {
  constructor(
    @inject('WalletBalancesRepository')
    private balancesRepository: IWalletBalancesRepository,
  ) {}

  public async execute({
    user_id,
    wallet_id,
    interval,
    start,
    end,
  }: X): Promise<IBalance[]> {
    const showWallet = container.resolve(ShowWalletService);

    const intervals = ['1d', '1w', '1m', '1y'];

    if (!intervals.includes(interval)) {
      throw new Error(
        `The given interval '${interval}' is invalid! Allowed values are: ${intervals}.`,
      );
    }

    const startDate = new Date(start);

    if (Number.isNaN(startDate.getTime())) {
      throw new Error(`The given start date '${start}' is invalid!`);
    }

    const endDate = new Date(end);

    if (Number.isNaN(endDate.getTime())) {
      throw new Error(`The given end date '${end}' is invalid!`);
    }

    const wallet = await showWallet.execute({ user_id, wallet_id });

    return this.balancesRepository.history({
      wallet_id: wallet.id,
      interval: interval as '1d' | '1w',
      start: startDate,
      end: endDate,
    });
  }
}

export default ShowHistoryService;
