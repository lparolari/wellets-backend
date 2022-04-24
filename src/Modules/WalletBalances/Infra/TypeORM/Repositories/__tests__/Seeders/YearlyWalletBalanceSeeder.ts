import { Seeder } from '@jorgebodega/typeorm-seeding';

import { mkBalance, mkCurrency, mkUser, mkWallet } from '../utils';

export default class YearlyWalletBalanceSeeder extends Seeder {
  public async run(): Promise<void> {
    await mkUser();
    await mkCurrency();
    await mkWallet();

    await mkBalance({
      balance: 100,
      created_at: new Date('2020-01-01 15:00:00'),
    });
    await mkBalance({
      balance: 200,
      created_at: new Date('2020-01-01 16:00:00'),
    });
    await mkBalance({
      balance: 70,
      created_at: new Date('2020-01-07 9:00:00'),
    });
    await mkBalance({
      balance: 300,
      created_at: new Date('2020-03-07 15:00:00'),
    });
    await mkBalance({
      balance: 200,
      created_at: new Date('2022-02-03 18:00:00'),
    });
    await mkBalance({
      balance: 1,
      created_at: new Date('2022-03-25 18:30:00'),
    });
  }
}
