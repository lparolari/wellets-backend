import { container } from 'tsyringe';
import { getRepository } from 'typeorm';
import { Seeder } from '@jorgebodega/typeorm-seeding';

import IHashProvider from 'Shared/Containers/HashProvider/Models/IHashProvider';

import User from 'Modules/Users/Infra/TypeORM/Entities/User';
import CurrencyPreference from 'Modules/CurrencyPreferences/Infra/TypeORM/Entities/CurrencyPreference';
import UserSettings from 'Modules/Users/Infra/TypeORM/Entities/UserSettings';
import Currency from 'Modules/Currencies/Infra/TypeORM/Entities/Currency';

// eslint-disable-next-line import/prefer-default-export
export class UserSeeder extends Seeder {
  async run(): Promise<void> {
    const hashProvider = container.resolve<IHashProvider>('HashProvider');
    const usersRepository = getRepository(User);
    const settingsRepository = getRepository(UserSettings);
    const preferencesRepository = getRepository(CurrencyPreference);
    const currencyRepository = getRepository(Currency);

    const pw = await hashProvider.encrypt('AAaa-0000');

    // create users
    const user1 = {
      id: 'b0eefde5-16c6-4b0f-ba2f-fe8719d4d5c4',
      email: 'test@test.com',
      password: pw,
    };
    const user2 = {
      id: 'abf1b8c1-d378-40a4-81a8-fe1bafea39ea',
      email: 'test1@test.com',
      password: pw,
    };

    // create user settings
    const btc = await currencyRepository.findOneOrFail({ acronym: 'BTC' });
    const usd = await currencyRepository.findOneOrFail({ acronym: 'USD' });
    const eur = await currencyRepository.findOneOrFail({ acronym: 'EUR' });
    const eth = await currencyRepository.findOneOrFail({ acronym: 'ETH' });

    const setting1 = {
      id: '786f2e0c-902a-49dd-b487-24baf6561016',
      user_id: user1.id,
      currency_id: usd.id,
    };
    const setting2 = {
      id: 'a07e1cdf-80a7-4ce1-bbcb-2420f8b1fd91',
      user_id: user2.id,
      currency_id: eur.id,
    };

    // create user preferences
    const preference1 = {
      id: 'b7e6e0e0-2a49-4607-8d01-6615ad96bb1a',
      user_id: user1.id,
      currency_id: btc.id,
    };
    const preference2 = {
      id: '5f0d03fb-067e-473e-a0ae-66c4e0630720',
      user_id: user1.id,
      currency_id: eth.id,
      favorite: true,
    };
    const preference3 = {
      id: '683d061e-19d7-4513-86e6-89db95ec22ae',
      user_id: user2.id,
      currency_id: btc.id,
      favorite: true,
    };
    const preference4 = {
      id: 'f8f7e585-9c82-4b63-a61f-df98af3e257a',
      user_id: user2.id,
      currency_id: usd.id,
      favorite: true,
    };
    const preference5 = {
      id: 'c63c6840-d1d2-4916-9e1e-36b5da2b9de8',
      user_id: user2.id,
      currency_id: eur.id,
      favorite: true,
    };

    // presist data
    await usersRepository.upsert([user1, user2], ['id']);
    await settingsRepository.upsert([setting1, setting2], ['id']);
    await preferencesRepository.upsert(
      [preference1, preference2, preference3, preference4, preference5],
      ['id'],
    );
  }
}
