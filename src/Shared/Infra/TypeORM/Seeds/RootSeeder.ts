/* eslint-disable import/prefer-default-export */

import { Connection } from 'typeorm';
import { Seeder } from '@jorgebodega/typeorm-seeding';

import cleanDatabase from '../cleanDatabase';

export class RootSeeder extends Seeder {
  async run(connection: Connection): Promise<void> {
    cleanDatabase();

    // TODO: seeding

    await this.call(connection, []);
  }
}
