/* eslint-disable import/prefer-default-export */
/* eslint-disable max-classes-per-file */

import 'Shared/Containers';

import Currency from 'Modules/Currencies/Infra/TypeORM/Entities/Currency';
import User from 'Modules/Users/Infra/TypeORM/Entities/User';
import { IBalance } from 'Modules/WalletBalances/DTOs/IBalance';
import IWalletBalancesRepository from 'Modules/WalletBalances/Repositories/IWalletBalancesRepository';
import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';
import { container } from 'tsyringe';
import { getRepository } from 'typeorm';

import { Factory, Seeder } from '@jorgebodega/typeorm-seeding';

import WalletBalance from '../../Entities/WalletBalance';

export const ONE_HOUR_MS = 1000 * 60 * 60;
export const ONE_DAY_MS = 1000 * 60 * 60 * 24;

export const WALLET_ID = 'cc41a557-3612-4173-a19e-a71b19cec75b';

export const FAKE_DATE = new Date('2020-01-01 15:00:00');

export const forwardDate = (date: Date, forwardMs: number): Date => {
  return new Date(date.getTime() + forwardMs);
};

export const getBalancesRepository = (): IWalletBalancesRepository =>
  container.resolve<IWalletBalancesRepository>('WalletBalancesRepository');

export const getHistory = async ({
  balancesRepository,
  wallet_id,
  interval,
  start,
  end,
}: {
  balancesRepository: IWalletBalancesRepository;
  wallet_id?: string;
  interval?: string;
  start?: Date;
  end?: Date;
}): Promise<IBalance[]> =>
  balancesRepository.history({
    wallet_id: wallet_id || WALLET_ID,
    interval: (interval as '1d' | '1w') || '1d',
    start,
    end,
  });

class WalletBalanceFactory extends Factory<WalletBalance> {
  protected definition(): Promise<WalletBalance> {
    const walletBalance = new WalletBalance();
    return Promise.resolve(walletBalance);
  }
}

export class TestSeeder extends Seeder {
  public async run(): Promise<void> {
    const usersRepository = getRepository(User);
    const walletsRepository = getRepository(Wallet);
    const currenciesRepository = getRepository(Currency);

    const walletBalanceFactory = new WalletBalanceFactory();

    const user = await usersRepository.save(
      usersRepository.create({
        email: 'example@example.com',
        password: 'secret',
      }),
    );

    const currency = await currenciesRepository.save(
      currenciesRepository.create({
        acronym: 'USD',
        alias: 'US Dollar',
        dollar_rate: 1,
      }),
    );

    const wallet = await walletsRepository.save(
      walletsRepository.create({
        id: WALLET_ID,
        alias: 'foo',
        balance: 0,
        currency,
        user,
      }),
    );

    await walletBalanceFactory.create({
      wallet,
      balance: 100,
      created_at: new Date('2020-01-01 15:00:00'),
    });
    await walletBalanceFactory.create({
      wallet,
      balance: 200,
      created_at: new Date('2020-01-01 16:00:00'),
    });
    await walletBalanceFactory.create({
      wallet,
      balance: 300,
      created_at: new Date('2020-01-02 15:00:00'),
    });
    await walletBalanceFactory.create({
      wallet,
      balance: 100,
      created_at: new Date('2020-01-02 16:00:00'),
    });
    await walletBalanceFactory.create({
      wallet,
      balance: 100,
      created_at: new Date('2020-01-03 18:00:00'),
    });
    await walletBalanceFactory.create({
      wallet,
      balance: 1,
      created_at: new Date('2020-01-03 18:30:00'),
    });
    await walletBalanceFactory.create({
      wallet,
      balance: 5,
      created_at: new Date('2020-01-04 5:00:00'),
    });
    await walletBalanceFactory.create({
      wallet,
      balance: 70,
      created_at: new Date('2020-01-07 9:00:00'),
    });
  }
}
