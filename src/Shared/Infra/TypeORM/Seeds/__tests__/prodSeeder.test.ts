import 'dotenv/config';
import 'reflect-metadata';
import 'Shared/Containers';

import { createConnection, getConnection, getRepository } from 'typeorm';
import { useSeeders } from '@jorgebodega/typeorm-seeding';

import cleanDatabase from 'Shared/Infra/TypeORM/cleanDatabase';

import Currency from 'Modules/Currencies/Infra/TypeORM/Entities/Currency';

import { ProdSeeder } from '../ProdSeeder';

beforeAll(async () => {
  await createConnection();
});

beforeEach(async () => {
  await cleanDatabase();
  await useSeeders([ProdSeeder]);
});

afterAll(async () => {
  await getConnection().close();
});

describe('ProdSeeder', () => {
  it('creates currencies', async () => {
    const currenciesRepository = getRepository(Currency);
    expect(await currenciesRepository.count()).toBe(10);
  });
});
