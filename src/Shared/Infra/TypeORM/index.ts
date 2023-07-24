import { createConnection } from 'typeorm';

import './polyfill';
import log from '../../Helpers/log';

class TypeORM {
  public async run(): Promise<void> {
    try {
      await createConnection();
      log('PostgresSQL Connected :)', 'green');
    } catch (e) {
      log('PostgresSQL Not Connected ;-;', 'red');
      log(e, 'red');
      throw new Error(e);
    }
  }
}

export default TypeORM;
