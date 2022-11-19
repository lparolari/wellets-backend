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

import Asset from 'Modules/Assets/Infra/TypeORM/Entities/Asset';
import AssetEntry from 'Modules/Assets/Infra/TypeORM/Entities/AssetEntry';
import { CurrencySeeder } from '../CurrencySeeder/CurrencySeeder';

const saveAt = async <T>(
  repository: Repository<T>,
  entities: T[],
): Promise<void> => {
  for (const entity of entities) {
    await repository.save(entity as any);
  }
};

// eslint-disable-next-line import/prefer-default-export
export class Workspace2Seeder extends Seeder {
  async run(_connection: Connection): Promise<void> {
    const hashProvider = container.resolve<IHashProvider>('HashProvider');
    const usersRepository = getRepository(User);
    const settingsRepository = getRepository(UserSettings);
    const preferencesRepository = getRepository(CurrencyPreference);
    const currenciesRepository = getRepository(Currency);
    const walletsRepository = getRepository(Wallet);
    const transactionsRepository = getRepository(Transaction);
    const portfoliosRepository = getRepository(Portfolio);
    const assetsRepository = getRepository(Asset);
    const assetEntriesRepository = getRepository(AssetEntry);

    await this.call(_connection, [CurrencySeeder]);

    // create users
    const pw = await hashProvider.encrypt('AAaa-0000');

    const user = usersRepository.create({
      id: '18d9c67c-a7df-4b22-b729-2b2f86865e58',
      email: 'test1@test.com',
      password: pw,
    });

    // create currencies
    const btc = await currenciesRepository.findOneOrFail({ acronym: 'BTC' });
    const usd = await currenciesRepository.findOneOrFail({ acronym: 'USD' });
    const eth = await currenciesRepository.findOneOrFail({ acronym: 'ETH' });

    // create user settings
    const settings = settingsRepository.create({
      id: 'd198a899-40c0-426e-a262-603bb7a70ac6',
      user_id: user.id,
      currency_id: usd.id,
    });

    // create user preferences
    const preference1 = preferencesRepository.create({
      id: '4a64c931-5414-46d9-aa86-06dd87b55e49',
      user_id: user.id,
      currency_id: btc.id,
      favorite: true,
    });
    const preference2 = preferencesRepository.create({
      id: '65b6b5b0-7f6a-4daa-9f14-2a1f7a97ad78',
      user_id: user.id,
      currency_id: eth.id,
      favorite: true,
    });

    // create assets
    const asset1 = assetsRepository.create({
      id: '6994d781-6c7e-48b5-bf5d-37ecfdfe8ce5',
      user_id: user.id,
      currency_id: usd.id,
      balance: 7842.2,
    });
    const asset2 = assetsRepository.create({
      id: 'b76c2c05-e4fd-492a-a9cc-61bd6b95d1a2',
      user_id: user.id,
      currency_id: btc.id,
      balance: 0.5,
    });
    const asset3 = assetsRepository.create({
      id: '52454c49-9d98-4e5c-ac87-2c48d1f8358b',
      user_id: user.id,
      currency_id: eth.id,
      balance: 0.8,
    });

    // create wallets
    const wallet1 = walletsRepository.create({
      id: '17c19fa2-0c8f-462a-9521-82682e1f7aa9',
      alias: 'Bitcoin',
      user_id: user.id,
      currency_id: btc.id,
      balance: 0.5,
    });
    const wallet2 = walletsRepository.create({
      id: '134fbee0-4703-43af-a231-f8082854a907',
      alias: 'Bank',
      user_id: user.id,
      currency_id: usd.id,
      balance: 7842.2,
    });
    const wallet3 = walletsRepository.create({
      id: '52b14667-d3b1-4081-8908-80d497c3dbaa',
      alias: 'Ethereum',
      user_id: user.id,
      currency_id: eth.id,
      balance: 0.8,
    });

    // create transactions
    const transaction1 = transactionsRepository.create({
      id: 'a1f2bd7f-e2f8-4e1b-891a-02826306144e',
      value: 0.2,
      description: 'Buy',
      wallet_id: wallet1.id,
      created_at: new Date('2020-01-01 15:00:00'),
    });
    const transaction2 = transactionsRepository.create({
      id: '94d801ab-3020-4657-8f16-4260ccc5708f',
      value: 0.2,
      description: 'Buy',
      wallet_id: wallet1.id,
      created_at: new Date('2020-01-03 15:00:00'),
    });
    const transaction3 = transactionsRepository.create({
      id: '2fbfb387-fce2-432f-b8b4-a22f8c74ece6',
      value: 0.1,
      description: 'Payment from friend',
      wallet_id: wallet1.id,
      created_at: new Date('2020-01-07 15:00:00'),
    });

    const transactions = [transaction1, transaction2, transaction3];

    // create asset entries
    const assetEntry1 = assetEntriesRepository.create({
      id: '0993cd7b-a0c8-4e4c-a98c-dd12139f827c',
      asset_id: asset2.id,
      transaction_id: transaction1.id,
      value: transaction1.value,
      dollar_rate: 0.000025,
    });
    const assetEntry2 = assetEntriesRepository.create({
      id: 'd9df27ec-0caf-4e40-85eb-64b3308e0c87',
      asset_id: asset2.id,
      transaction_id: transaction2.id,
      value: transaction2.value,
      dollar_rate: 0.00002,
    });
    const assetEntry3 = assetEntriesRepository.create({
      id: '82d23971-03c8-4f7a-8d1b-13a5631f020f',
      asset_id: asset2.id,
      transaction_id: transaction3.id,
      value: transaction3.value,
      dollar_rate: 0.000025,
    });

    const assetEntries = [assetEntry1, assetEntry2, assetEntry3];

    // create portfolios
    const portfolio1 = portfoliosRepository.create({
      id: 'abeea6f7-3492-458f-9a52-ee7c9b811f71',
      alias: 'Main',
      weight: 1,
      user_id: user.id,
      parent_id: undefined,
    });
    const portfolio2 = portfoliosRepository.create({
      id: '718284e3-dfa5-4c03-b1dc-0e4a5f495376',
      alias: 'Crypto',
      weight: 0.25,
      user_id: user.id,
      parent_id: portfolio1.id,
      wallets: [wallet3],
    });
    const portfolio3 = portfoliosRepository.create({
      id: '6e833b9a-888c-4011-804d-0caf2e37b9e8',
      alias: 'Cash',
      weight: 0.75,
      user_id: user.id,
      parent_id: portfolio1.id,
      wallets: [wallet2],
    });
    const portfolio4 = portfoliosRepository.create({
      id: '7912f133-ee5f-4979-a2a9-49be16008c86',
      alias: 'Bitcoin',
      weight: 1,
      user_id: user.id,
      parent_id: portfolio2.id,
      wallets: [wallet1],
    });

    const portfolios = [portfolio1, portfolio2, portfolio3, portfolio4];

    // persist data
    await saveAt(usersRepository, [user]);
    await saveAt(settingsRepository, [settings]);
    await saveAt(preferencesRepository, [preference1, preference2]);
    await saveAt(walletsRepository, [wallet1, wallet2, wallet3]);
    await saveAt(transactionsRepository, transactions);
    await saveAt(portfoliosRepository, portfolios);
    await saveAt(assetsRepository, [asset1, asset2, asset3]);
    await saveAt(assetEntriesRepository, assetEntries);
  }
}
