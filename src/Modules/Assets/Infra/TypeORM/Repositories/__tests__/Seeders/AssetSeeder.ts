import { Seeder } from '@jorgebodega/typeorm-seeding';

import {
  mkEntry,
  mkCurrency,
  mkUser,
  mkAsset,
  mkWallet,
  mkTransaction,
} from '../utils';

export default class AssetSeeder extends Seeder {
  public async run(): Promise<void> {
    await mkUser();
    await mkCurrency();
    await mkAsset();
    await mkWallet();
    await mkTransaction();

    await mkEntry({
      value: 100,
      created_at: new Date('2020-01-01 15:00:00'),
    });
    await mkEntry({
      value: 200,
      created_at: new Date('2020-01-01 16:00:00'),
    });
    await mkEntry({
      value: 300,
      created_at: new Date('2020-01-02 15:00:00'),
    });
    await mkEntry({
      value: 100,
      created_at: new Date('2020-01-02 16:00:00'),
    });
    await mkEntry({
      value: -100,
      created_at: new Date('2020-01-03 18:00:00'),
    });
    await mkEntry({
      value: 1,
      created_at: new Date('2020-01-03 18:30:00'),
    });
    await mkEntry({
      value: 5,
      created_at: new Date('2020-01-04 5:00:00'),
    });
    await mkEntry({
      value: 70,
      created_at: new Date('2020-01-07 9:00:00'),
    });
  }
}
