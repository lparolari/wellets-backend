import { Connection } from 'typeorm';
import { Seeder } from '@jorgebodega/typeorm-seeding';

import { CurrencySeeder } from './CurrencySeeder/CurrencySeeder';
import { WorkspaceSeeder } from './WorkspaceSeeder/WorkspaceSeeder';

// eslint-disable-next-line import/prefer-default-export
export class DevSeeder extends Seeder {
  async run(connection: Connection): Promise<void> {
    await this.call(connection, [CurrencySeeder, WorkspaceSeeder]);
  }
}
