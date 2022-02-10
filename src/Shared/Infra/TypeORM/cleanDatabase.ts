import { getRepository, Repository } from 'typeorm';

import User from 'Modules/Users/Infra/TypeORM/Entities/User';
import UserSettings from 'Modules/Users/Infra/TypeORM/Entities/UserSettings';
import Currency from 'Modules/Currencies/Infra/TypeORM/Entities/Currency';
import CurrencyPreference from 'Modules/CurrencyPreferences/Infra/TypeORM/Entities/CurrencyPreference';
import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';
import Transaction from 'Modules/Transactions/Infra/TypeORM/Entities/Transaction';
import Transfer from 'Modules/Transfers/Infra/TypeORM/Entities/Transfer';
import Portfolio from 'Modules/Portfolios/Infra/TypeORM/Entities/Portfolio';

export default function cleanDatabase(): void {
  const usersRepository = getRepository(User);
  const userSettingsRepository = getRepository(UserSettings);
  const currenciesRepository = getRepository(Currency);
  const currencyPreferencesRepository = getRepository(CurrencyPreference);
  const walletsRepository = getRepository(Wallet);
  const transactionsRepository = getRepository(Transaction);
  const transfersRepository = getRepository(Transfer);
  const portfoliosRepository = getRepository(Portfolio);

  const repos: Repository<unknown>[] = [
    portfoliosRepository,
    walletsRepository,
    transfersRepository,
    transactionsRepository,
    currencyPreferencesRepository,
    currenciesRepository,
    userSettingsRepository,
    usersRepository,
  ];

  repos.forEach(repo => repo.delete({}));
}
