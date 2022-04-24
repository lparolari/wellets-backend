import { Connection } from 'typeorm';
import { Seeder } from '@jorgebodega/typeorm-seeding';

import { Workspace1Seeder } from './Workspace1Seeder';

// eslint-disable-next-line import/prefer-default-export
export class WorkspaceSeeder extends Seeder {
  async run(connection: Connection): Promise<void> {
    await this.call(connection, [Workspace1Seeder]);
  }
}
