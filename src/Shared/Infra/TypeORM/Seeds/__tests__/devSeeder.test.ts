import 'dotenv/config';
import 'reflect-metadata';
import 'Shared/Containers';

import { createConnection, getConnection, getRepository } from 'typeorm';
import { useSeeders } from '@jorgebodega/typeorm-seeding';

import cleanDatabase from 'Shared/Infra/TypeORM/cleanDatabase';

import Currency from 'Modules/Currencies/Infra/TypeORM/Entities/Currency';
import User from 'Modules/Users/Infra/TypeORM/Entities/User';
import UserSettings from 'Modules/Users/Infra/TypeORM/Entities/UserSettings';
import CurrencyPreference from 'Modules/CurrencyPreferences/Infra/TypeORM/Entities/CurrencyPreference';

import { DevSeeder } from '../DevSeeder';

beforeAll(async () => {
  await createConnection();
});

beforeEach(async () => {
  await cleanDatabase();
  await useSeeders([DevSeeder]);
});

afterAll(async () => {
  await getConnection().close();
});

describe('DevSeeder', () => {
  it('creates currencies', async () => {
    const currenciesRepository = getRepository(Currency);
    expect(await currenciesRepository.count()).toBe(10);
  });

  it('creates users', async () => {
    const usersRepository = getRepository(User);
    expect(await usersRepository.count()).toBe(2);
  });

  it("creates user's settings", async () => {
    const settingsRepository = getRepository(UserSettings);
    expect(await settingsRepository.count()).toBe(2);
  });

  it("creates user's preferences", async () => {
    const preferencesRepository = getRepository(CurrencyPreference);
    expect(await preferencesRepository.count()).toBe(4);
  });

  // TODO: add missing checks or move this test in worksapceSeeder test suite.
});
