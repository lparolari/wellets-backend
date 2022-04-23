/* eslint-disable max-classes-per-file */
import path from 'path';
import fs from 'fs';

import { Seeder } from '@jorgebodega/typeorm-seeding';

import Currency from 'Modules/Currencies/Infra/TypeORM/Entities/Currency';
import { getRepository } from 'typeorm';

type CurrenciesData = {
  [key: string]: {
    id: string;
    name: string;
    code: string;
  };
};

const loadCurrenciesData = (): CurrenciesData => {
  const currenciesPath = path.resolve(__dirname, 'Currencies.json');
  const currenciesJson = fs.readFileSync(currenciesPath, {
    encoding: 'utf-8',
  });
  const currencies = JSON.parse(currenciesJson) as CurrenciesData;
  return currencies;
};

// eslint-disable-next-line import/prefer-default-export
export class CurrencySeeder extends Seeder {
  async run(): Promise<void> {
    const currenciesRepository = getRepository(Currency);

    const currenciesData = loadCurrenciesData();

    const promises = Object.values(currenciesData).map(({ id, code, name }) =>
      currenciesRepository.upsert(
        [
          {
            id,
            acronym: code,
            alias: name,
            dollar_rate: 1.0, // fake, updated later
          },
        ],
        ['id'],
      ),
    );

    await Promise.all(promises);
  }
}
