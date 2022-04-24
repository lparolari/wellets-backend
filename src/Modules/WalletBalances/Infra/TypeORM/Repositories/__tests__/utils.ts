import 'Shared/Containers';

import { getRepository } from 'typeorm';
import { container } from 'tsyringe';

import Currency from 'Modules/Currencies/Infra/TypeORM/Entities/Currency';
import User from 'Modules/Users/Infra/TypeORM/Entities/User';
import { IBalance } from 'Modules/WalletBalances/DTOs/IBalance';
import IWalletBalancesRepository from 'Modules/WalletBalances/Repositories/IWalletBalancesRepository';
import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';

import WalletBalance from '../../Entities/WalletBalance';

export const USER_ID = 'f3156082-d35e-4fdd-a98b-f0e151b08bc3';
export const CURRENCY_ID = 'ca075633-c843-4502-8790-dba18a8191ef';
export const WALLET_ID = 'cc41a557-3612-4173-a19e-a71b19cec75b';

export const getBalancesRepository = (): IWalletBalancesRepository =>
  container.resolve<IWalletBalancesRepository>('WalletBalancesRepository');

export const getHistory = async ({
  balancesRepository,
  interval,
  start,
  end,
}: {
  balancesRepository: IWalletBalancesRepository;
  interval?: string;
  start?: Date;
  end?: Date;
}): Promise<IBalance[]> =>
  balancesRepository.history({
    wallet_id: WALLET_ID,
    interval: (interval as '1d' | '1w' | '1M') || '1d',
    start,
    end,
  });

export const mkUser = async (): Promise<User> => {
  const usersRepository = getRepository(User);
  return usersRepository.save(
    usersRepository.create({
      id: USER_ID,
      email: 'example@example.com',
      password: 'secret',
    }),
  );
};

export const mkCurrency = async (): Promise<Currency> => {
  const currenciesRepository = getRepository(Currency);
  return currenciesRepository.save(
    currenciesRepository.create({
      id: CURRENCY_ID,
      acronym: 'USD',
      alias: 'US Dollar',
      dollar_rate: 1,
    }),
  );
};

export const mkWallet = async (): Promise<Wallet> => {
  const walletsRepository = getRepository(Wallet);
  return walletsRepository.save(
    walletsRepository.create({
      id: WALLET_ID,
      alias: 'foo',
      balance: 0,
      currency_id: CURRENCY_ID,
      user_id: USER_ID,
    }),
  );
};

export const mkBalance = async ({
  balance,
  created_at,
}: {
  balance: number;
  created_at: Date;
}): Promise<WalletBalance> => {
  const walletBalancesRepository = getRepository(WalletBalance);
  return walletBalancesRepository.save(
    walletBalancesRepository.create({
      balance,
      created_at,
      wallet_id: WALLET_ID,
    }),
  );
};
