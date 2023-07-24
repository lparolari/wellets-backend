/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/prefer-default-export */
/* eslint-disable max-classes-per-file */

import { Connection } from 'typeorm';
import { Factory, Seeder } from '@jorgebodega/typeorm-seeding';
import faker from '@faker-js/faker';
import { container } from 'tsyringe';

import User from 'Modules/Users/Infra/TypeORM/Entities/User';
import UserSettings from 'Modules/Users/Infra/TypeORM/Entities/UserSettings';
import Currency from 'Modules/Currencies/Infra/TypeORM/Entities/Currency';
import CurrencyPreference from 'Modules/CurrencyPreferences/Infra/TypeORM/Entities/CurrencyPreference';
import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';
import Transaction from 'Modules/Transactions/Infra/TypeORM/Entities/Transaction';
import Transfer from 'Modules/Transfers/Infra/TypeORM/Entities/Transfer';
import Portfolio from 'Modules/Portfolios/Infra/TypeORM/Entities/Portfolio';

import IHashProvider from 'Shared/Containers/HashProvider/Models/IHashProvider';
import IRatesProvider from 'Shared/Containers/RatesProvider/Models/IRatesProvider';

import cleanDatabase from '../cleanDatabase';

import 'Shared/Containers';

class UserFactory extends Factory<User> {
  constructor(private hashProvider: IHashProvider) {
    super();
  }

  protected definition(): Promise<User> {
    return (async () => {
      const user = new User();

      user.email = faker.internet.email();
      user.password = await this.hashProvider.encrypt('test1234');

      return user;
    })();
  }
}

class CurrencyFactory extends Factory<Currency> {
  protected definition(): Promise<Currency> {
    const currency = new Currency();

    currency.acronym = faker.finance.currencyCode();
    currency.alias = faker.finance.currencyName();
    currency.dollar_rate = faker.datatype.number();

    return Promise.resolve(currency);
  }
}

class CurrencyPreferenceFactory extends Factory<CurrencyPreference> {
  protected definition(): Promise<CurrencyPreference> {
    const currencyPreference = new CurrencyPreference();

    currencyPreference.favorite = true;

    return Promise.resolve(currencyPreference);
  }
}

class UserSettingsFactory extends Factory<UserSettings> {
  protected definition(): Promise<UserSettings> {
    const userSettings = new UserSettings();
    return Promise.resolve(userSettings);
  }
}

class WalletFactory extends Factory<Wallet> {
  protected definition(): Promise<Wallet> {
    const wallet = new Wallet();

    wallet.alias = faker.finance.accountName();
    wallet.balance = faker.datatype.number({ min: 0, max: 1000 });

    return Promise.resolve(wallet);
  }
}

class TransactionFactory extends Factory<Transaction> {
  protected definition(): Promise<Transaction> {
    const transaction = new Transaction();

    transaction.description = faker.finance.transactionDescription();
    transaction.value = faker.datatype.number({
      min: -50,
      max: 50,
      precision: 2,
    });

    return Promise.resolve(transaction);
  }
}

class TransferFactory extends Factory<Transfer> {
  private from_wallet: Wallet;

  private to_wallet: Wallet;

  protected definition(): Promise<Transfer> {
    const transfer = new Transfer();

    transfer.from_wallet = this.from_wallet;
    transfer.to_wallet = this.to_wallet;
    transfer.value = faker.datatype.number({ min: 1, max: 20, precision: 2 });
    transfer.static_fee = faker.datatype.number({
      min: 0,
      max: 0.01,
      precision: 4,
    });
    transfer.percentual_fee = faker.datatype.number({
      min: 0,
      max: 4,
      precision: 2,
    });
    transfer.filled =
      ((transfer.value -
        (transfer.static_fee +
          (transfer.percentual_fee / 100) * transfer.value)) *
        transfer.to_wallet.currency.dollar_rate) /
      transfer.from_wallet.currency.dollar_rate;

    return Promise.resolve(transfer);
  }

  public withFromWallet(from_wallet: Wallet) {
    this.from_wallet = from_wallet;
    return this;
  }

  public withToWallet(to_wallet: Wallet) {
    this.to_wallet = to_wallet;
    return this;
  }
}

class PortfolioFactory extends Factory<Portfolio> {
  protected definition(): Promise<Portfolio> {
    const portfolio = new Portfolio();

    portfolio.alias = faker.finance.account();

    return Promise.resolve(portfolio);
  }
}

type PublicCurrencies = {
  USD: Currency;
  EUR: Currency;
};

async function createDemoWorkspace(
  user: User,
  currencies: PublicCurrencies,
  fixed = false,
): Promise<void> {
  const currencyFactory = new CurrencyFactory();
  const currencyPreferenceFactory = new CurrencyPreferenceFactory();
  const userSettingsFactory = new UserSettingsFactory();
  const walletFactory = new WalletFactory();
  const transactionFactory = new TransactionFactory();
  const transferFactory = new TransferFactory();
  const portfolioFactory = new PortfolioFactory();

  const btcCurrency = await currencyFactory.create({
    acronym: 'BTC',
    alias: 'Bitcoin',
    dollar_rate: 0.5,
  });

  const currencyPreference1 = await currencyPreferenceFactory.create({
    currency: btcCurrency,
    user,
  });
  const userSettings1 = await userSettingsFactory.create({
    user,
    currency: currencies.USD,
  });
  const wallet1 = await walletFactory.create({
    user,
    currency: currencies.USD,
  });
  const wallet2 = await walletFactory.create({
    user,
    currency: btcCurrency,
  });
  const wallet3 = await walletFactory.create({
    user,
    currency: btcCurrency,
  });
  const wallet4 = await walletFactory.create({
    user,
    currency: currencies.EUR,
    balance: 100,
  });

  await transactionFactory.create({ wallet: wallet1 });
  await transactionFactory.create({ wallet: wallet1 });
  await transactionFactory.create({ wallet: wallet2 });
  await transactionFactory.create({ wallet: wallet3 });
  await transactionFactory.create({ wallet: wallet3 });
  await transactionFactory.create({ wallet: wallet3 });

  await transferFactory.withFromWallet(wallet1).withToWallet(wallet2).create();
  await transferFactory.withFromWallet(wallet1).withToWallet(wallet2).create();
  await transferFactory.withFromWallet(wallet2).withToWallet(wallet3).create();
  await transferFactory.withFromWallet(wallet3).withToWallet(wallet1).create();
  await transferFactory.withFromWallet(wallet1).withToWallet(wallet3).create();

  const portfolio1 = await portfolioFactory.create({
    id: fixed ? '54cc9919-0cd7-4772-8af0-1af133c5516e' : undefined,
    alias: 'Main',
    user,
    weight: 1,
  });
  const portfolio2 = await portfolioFactory.create({
    id: fixed ? '875c8d16-9b85-4df3-b353-5f6c6aa8c94e' : undefined,
    alias: 'Cash',
    user,
    weight: 0.5,
    parent: portfolio1,
    wallets: [wallet1],
  });
  const portfolio3 = await portfolioFactory.create({
    id: fixed ? 'daaef532-8c94-4968-9b0a-925ffc8104f3' : undefined,
    alias: 'Crypto',
    user,
    weight: 0.5,
    parent: portfolio1,
    wallets: [wallet2, wallet3],
  });
  const portfolio4 = await portfolioFactory.create({
    id: fixed ? 'f5c075c4-f8de-4fea-b493-bd98b8e91d7a' : undefined,
    alias: 'Bank',
    user,
    weight: 1,
    wallets: [wallet4],
  });
}

export class RootSeeder extends Seeder {
  async run(connection: Connection): Promise<void> {
    const hashProvider = container.resolve<IHashProvider>('HashProvider');
    const ratesProvider = container.resolve<IRatesProvider>('RatesProvider');

    const userFactory = new UserFactory(hashProvider);
    const currencyFactory = new CurrencyFactory();

    // seed
    await cleanDatabase();

    const user1 = await userFactory.create({ email: 'test@test.com' });
    const user2 = await userFactory.create({ email: 'test1@test.com' });

    const currency1 = await currencyFactory.create({
      acronym: 'USD',
      alias: 'US Dollar',
      dollar_rate: 1,
    });

    const currency2 = await currencyFactory.create({
      acronym: 'EUR',
      alias: 'Euro',
      dollar_rate: 0.87,
    });

    const currencies: PublicCurrencies = {
      USD: currency1,
      EUR: currency2,
    };
    await createDemoWorkspace(user1, currencies, true);
    await createDemoWorkspace(user2, currencies);
  }
}
