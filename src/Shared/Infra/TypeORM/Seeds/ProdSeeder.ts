import { Seeder } from '@jorgebodega/typeorm-seeding';
import { Connection } from 'typeorm';

import { CurrencySeeder } from './CurrencySeeder/CurrencySeeder';

// eslint-disable-next-line import/prefer-default-export
export class ProdSeeder extends Seeder {
  async run(connection: Connection): Promise<void> {
    await this.call(connection, [CurrencySeeder]);
  }
}
