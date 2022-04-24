import { container } from 'tsyringe';
import { Connection, getRepository, Repository } from 'typeorm';
import { Seeder } from '@jorgebodega/typeorm-seeding';

import IHashProvider from 'Shared/Containers/HashProvider/Models/IHashProvider';

import User from 'Modules/Users/Infra/TypeORM/Entities/User';
import CurrencyPreference from 'Modules/CurrencyPreferences/Infra/TypeORM/Entities/CurrencyPreference';
import UserSettings from 'Modules/Users/Infra/TypeORM/Entities/UserSettings';
import Currency from 'Modules/Currencies/Infra/TypeORM/Entities/Currency';
import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';
import Transaction from 'Modules/Transactions/Infra/TypeORM/Entities/Transaction';
import Portfolio from 'Modules/Portfolios/Infra/TypeORM/Entities/Portfolio';

import { CurrencySeeder } from '../CurrencySeeder/CurrencySeeder';

const saveAt = async <T>(
  repository: Repository<T>,
  entities: T[],
): Promise<void> => {
  for (const entity of entities) {
    await repository.save(entity);
  }
};

// eslint-disable-next-line import/prefer-default-export
export class Workspace1Seeder extends Seeder {
  async run(_connection: Connection): Promise<void> {
    const hashProvider = container.resolve<IHashProvider>('HashProvider');
    const usersRepository = getRepository(User);
    const settingsRepository = getRepository(UserSettings);
    const preferencesRepository = getRepository(CurrencyPreference);
    const currenciesRepository = getRepository(Currency);
    const walletsRepository = getRepository(Wallet);
    const transactionsRepository = getRepository(Transaction);
    const portfoliosRepository = getRepository(Portfolio);

    await this.call(_connection, [CurrencySeeder]);

    // create users
    const pw = await hashProvider.encrypt('AAaa-0000');

    const user = usersRepository.create({
      id: 'b0eefde5-16c6-4b0f-ba2f-fe8719d4d5c4',
      email: 'test@test.com',
      password: pw,
    });

    // create user settings
    const btc = await currenciesRepository.findOneOrFail({ acronym: 'BTC' });
    const usd = await currenciesRepository.findOneOrFail({ acronym: 'USD' });
    const eth = await currenciesRepository.findOneOrFail({ acronym: 'ETH' });

    const settings = settingsRepository.create({
      id: '786f2e0c-902a-49dd-b487-24baf6561016',
      user_id: user.id,
      currency_id: usd.id,
    });

    // create user preferences
    const preference1 = preferencesRepository.create({
      id: 'b7e6e0e0-2a49-4607-8d01-6615ad96bb1a',
      user_id: user.id,
      currency_id: btc.id,
      favorite: true,
    });
    const preference2 = preferencesRepository.create({
      id: '5f0d03fb-067e-473e-a0ae-66c4e0630720',
      user_id: user.id,
      currency_id: eth.id,
      favorite: true,
    });

    // create wallets
    const wallet1 = walletsRepository.create({
      id: '238e26a8-cc76-416e-aade-e9d6527ff278',
      alias: 'Bitcoin',
      user_id: user.id,
      currency_id: btc.id,
      balance: 0.5,
    });
    const wallet2 = walletsRepository.create({
      id: '9944e165-e393-4392-b76b-ee4f94597537',
      alias: 'Bank',
      user_id: user.id,
      currency_id: usd.id,
      balance: 7842.2,
    });
    const wallet3 = walletsRepository.create({
      id: '51839e4c-c003-4272-adb9-dd2295decf3e',
      alias: 'Ethereum',
      user_id: user.id,
      currency_id: eth.id,
      balance: 0.8,
    });

    // create transactions
    const transaction1 = transactionsRepository.create({
      id: 'b95b3d46-2626-4fe9-823d-a13469016b51',
      value: 0.2,
      description: 'Buy',
      dollar_rate: 0.000025,
      wallet_id: wallet1.id,
      created_at: new Date('2020-01-01 15:00:00'),
    });
    const transaction2 = transactionsRepository.create({
      id: '5cfef439-9c85-4fb7-a371-657f5d684087',
      value: 0.2,
      description: 'Buy',
      dollar_rate: 0.00002,
      wallet_id: wallet1.id,
      created_at: new Date('2020-01-03 15:00:00'),
    });
    const transaction3 = transactionsRepository.create({
      id: 'f2abf28d-97be-492f-b87f-19e9c8629464',
      value: 0.1,
      description: 'Payment from friend',
      dollar_rate: 0.000025,
      wallet_id: wallet1.id,
      created_at: new Date('2020-01-07 15:00:00'),
    });

    const transactions = [transaction1, transaction2, transaction3];

    // create portfolios
    const portfolio1 = portfoliosRepository.create({
      id: '7c353b0a-efe3-4291-af32-97c2e4950c34',
      alias: 'Main',
      weight: 1,
      user_id: user.id,
      parent_id: undefined,
    });
    const portfolio2 = portfoliosRepository.create({
      id: '98990eb2-951a-4970-8d45-be4aaa06473e',
      alias: 'Crypto',
      weight: 0.25,
      user_id: user.id,
      parent_id: portfolio1.id,
      wallets: [
        walletsRepository.create(wallet1),
        walletsRepository.create(wallet3),
      ],
    });
    const portfolio3 = portfoliosRepository.create({
      id: 'b2710725-1e25-484a-8ad8-a914b7f45cae',
      alias: 'Cash',
      weight: 0.75,
      user_id: user.id,
      parent_id: portfolio1.id,
      wallets: [walletsRepository.create(wallet2)],
    });

    // presist data
    await saveAt(usersRepository, [user]);
    await saveAt(settingsRepository, [settings]);
    await saveAt(preferencesRepository, [preference1, preference2]);
    await saveAt(walletsRepository, [wallet1, wallet2, wallet3]);
    await saveAt(transactionsRepository, transactions);
    await saveAt(portfoliosRepository, [portfolio1, portfolio2, portfolio3]);
  }
}