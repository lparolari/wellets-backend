import { Connection } from 'typeorm';
import { Seeder } from '@jorgebodega/typeorm-seeding';

import { UserSeeder } from './UserSeeder/UserSeeder';
import { CurrencySeeder } from './CurrencySeeder/CurrencySeeder';

// eslint-disable-next-line import/prefer-default-export
export class DevSeeder extends Seeder {
  async run(connection: Connection): Promise<void> {
    await this.call(connection, [CurrencySeeder, UserSeeder]);
  }
}
