import { getRepository, Repository } from 'typeorm';

import User from 'Modules/Users/Infra/TypeORM/Entities/User';
import UserSettings from 'Modules/Users/Infra/TypeORM/Entities/UserSettings';
import Currency from 'Modules/Currencies/Infra/TypeORM/Entities/Currency';
import CurrencyPreference from 'Modules/CurrencyPreferences/Infra/TypeORM/Entities/CurrencyPreference';
import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';
import Transaction from 'Modules/Transactions/Infra/TypeORM/Entities/Transaction';
import Transfer from 'Modules/Transfers/Infra/TypeORM/Entities/Transfer';
import Portfolio from 'Modules/Portfolios/Infra/TypeORM/Entities/Portfolio';
import WalletBalance from 'Modules/WalletBalances/Infra/TypeORM/Entities/WalletBalance';

export default async function cleanDatabase(): Promise<void> {
  const usersRepository = getRepository(User);
  const userSettingsRepository = getRepository(UserSettings);
  const currenciesRepository = getRepository(Currency);
  const currencyPreferencesRepository = getRepository(CurrencyPreference);
  const walletsRepository = getRepository(Wallet);
  const walletBalancesRepository = getRepository(WalletBalance);
  const transactionsRepository = getRepository(Transaction);
  const transfersRepository = getRepository(Transfer);
  const portfoliosRepository = getRepository(Portfolio);

  // please note that order matters
  const repos: Repository<unknown>[] = [
    portfoliosRepository,
    walletBalancesRepository,
    transfersRepository,
    transactionsRepository,
    walletsRepository,
    currencyPreferencesRepository,
    userSettingsRepository,
    currenciesRepository,
    usersRepository,
  ];

  for (const repo of repos) {
    // we truncate tables one by one
    await repo.delete({});
  }
}
