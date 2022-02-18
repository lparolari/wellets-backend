/* eslint-disable max-classes-per-file */
import 'dotenv/config';
import 'reflect-metadata';
import { createConnection, getConnection, getRepository } from 'typeorm';
// import { useSeeders } from '@jorgebodega/typeorm-seeding';

import 'Shared/Containers';
import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';
import User from 'Modules/Users/Infra/TypeORM/Entities/User';
import { Factory, Seeder, useSeeders } from '@jorgebodega/typeorm-seeding';
import cleanDatabase from 'Shared/Infra/TypeORM/cleanDatabase';
import Currency from 'Modules/Currencies/Infra/TypeORM/Entities/Currency';
import { container } from 'tsyringe';
import IWalletBalancesRepository from 'Modules/WalletBalances/Repositories/IWalletBalancesRepository';
import WalletBalance from '../../Entities/WalletBalance';

// TODO: move seeder and factory to helper file
class WalletBalanceFactory extends Factory<WalletBalance> {
  public constructor(private now: Date) {
    super();
  }

  protected definition(): Promise<WalletBalance> {
    const walletBalance = new WalletBalance();

    walletBalance.created_at = this.now;

    this.forwardDate();

    return Promise.resolve(walletBalance);
  }

  private forwardDate() {
    const ONE_DAY_MS = 1000 * 60 * 60 * 24;
    this.now = new Date(this.now.getTime() + ONE_DAY_MS);
  }
}

const WALLET_ID = 'cc41a557-3612-4173-a19e-a71b19cec75b';

class TestSeeder extends Seeder {
  public async run() {
    const fakeDate = new Date('2020-01-01 15:00:00');

    const usersRepository = getRepository(User);
    const walletsRepository = getRepository(Wallet);
    const currenciesRepository = getRepository(Currency);

    const walletBalanceFactory = new WalletBalanceFactory(fakeDate);

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
        format: '$ 00.00',
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

    await walletBalanceFactory.create({ wallet, balance: 100 });
    await walletBalanceFactory.create({ wallet, balance: 200 });
    await walletBalanceFactory.create({ wallet, balance: 300 });
    await walletBalanceFactory.create({ wallet, balance: 100 });
  }
}

const getBalancesRepository = () =>
  container.resolve<IWalletBalancesRepository>('WalletBalancesRepository');
const getHistory = async (balancesRepository: IWalletBalancesRepository) =>
  balancesRepository.history({
    wallet_id: WALLET_ID,
    interval: '1d',
    start: new Date(),
    end: new Date(),
  });

beforeAll(async () => {
  await createConnection();
});

beforeEach(async () => {
  await cleanDatabase();
  await useSeeders([TestSeeder]);
});

afterAll(async () => {
  await getConnection().close();
});

describe('wallet balances repository', () => {
  describe('history', () => {
    describe('given 1d interval', () => {
      it('returns an array', async () => {
        const balancesRepository = getBalancesRepository();
        const history = await getHistory(balancesRepository);

        expect(history).toBeInstanceOf(Array);
      });

      it('returns an array of 4 items', async () => {
        const balancesRepository = getBalancesRepository();
        const history = await getHistory(balancesRepository);

        expect(history.length).toBe(4);
      });

      it('returns an array of candels', async () => {
        const balancesRepository = getBalancesRepository();
        const history = await getHistory(balancesRepository);

        expect(history[0]).toHaveProperty('timestamp');
        expect(history[0]).toHaveProperty('open');
        expect(history[0]).toHaveProperty('close');
      });

      it('returns an array sorted by timestamp', async () => {
        const balancesRepository = getBalancesRepository();
        const history = await getHistory(balancesRepository);

        for (const h of history) {
          expect(new Date(h.timestamp).getTime()).toBeLessThan(
            new Date(h.timestamp).getTime(),
          );
        }
      });
    });
  });
});
