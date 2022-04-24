import 'dotenv/config';
import 'reflect-metadata';
import 'Shared/Containers';

import cleanDatabase from 'Shared/Infra/TypeORM/cleanDatabase';
import { createConnection, getConnection } from 'typeorm';

import { useSeeders } from '@jorgebodega/typeorm-seeding';

import { getBalancesRepository, getHistory } from './utils';
import DailyWalletBalanceSeeder from './Seeders/DailyWalletBalanceSeeder';
import MontlyWalletBalanceSeeder from './Seeders/MontlyWalletBalanceSeeder';
import YearlyWalletBalanceSeeder from './Seeders/YearlyWalletBalanceSeeder';
import HourlyWalletBalanceSeeder from './Seeders/HourlyWalletBalanceSeeder';

beforeAll(async () => {
  await createConnection();
});

afterAll(async () => {
  await getConnection().close();
});

describe('wallet balances repository', () => {
  describe('history', () => {
    describe('given 1d interval', () => {
      beforeEach(async () => {
        await cleanDatabase();
        await useSeeders([DailyWalletBalanceSeeder]);
      });

      it('returns an array', async () => {
        const balancesRepository = getBalancesRepository();
        const history = await getHistory({ balancesRepository });

        expect(history).toBeInstanceOf(Array);
      });

      it('returns correct number of groups by date', async () => {
        const balancesRepository = getBalancesRepository();
        const history = await getHistory({ balancesRepository });

        expect(history.length).toBe(5);
      });

      it('returns an array of balances', async () => {
        const balancesRepository = getBalancesRepository();
        const history = await getHistory({ balancesRepository });

        expect(history[0]).toHaveProperty('timestamp');
        expect(history[0]).toHaveProperty('balance');
      });

      it('returns an array sorted by timestamp', async () => {
        const balancesRepository = getBalancesRepository();
        const history = await getHistory({ balancesRepository });

        for (const h of history) {
          expect(new Date(h.timestamp).getTime()).toBeLessThanOrEqual(
            new Date(h.timestamp).getTime(),
          );
        }
      });

      it('returns an array with the correct balance', async () => {
        const balancesRepository = getBalancesRepository();
        const history = await getHistory({ balancesRepository });

        expect(history[0].balance).toBeCloseTo(150);
        expect(history[1].balance).toBeCloseTo(200);
        expect(history[2].balance).toBeCloseTo(101 / 2);
        expect(history[3].balance).toBeCloseTo(5);
        expect(history[4].balance).toBeCloseTo(70);
      });

      it('returns balances filtered by start date', async () => {
        const balancesRepository = getBalancesRepository();
        const history = await getHistory({
          balancesRepository,
          start: new Date('2020-01-02 15:00:00'),
        });

        expect(history.length).toBe(4);
        expect(history[0].balance).toBeCloseTo(200);
        expect(history[1].balance).toBeCloseTo(101 / 2);
        expect(history[2].balance).toBeCloseTo(5);
        expect(history[3].balance).toBeCloseTo(70);
      });

      it('returns balances filtered by end date', async () => {
        const balancesRepository = getBalancesRepository();
        const history = await getHistory({
          balancesRepository,
          end: new Date('2020-01-02 15:30:00'),
        });

        expect(history.length).toBe(2);
        expect(history[0].balance).toBeCloseTo(150);
        expect(history[1].balance).toBeCloseTo(300);
      });

      it('returns balances filtered by start and end date', async () => {
        const balancesRepository = getBalancesRepository();
        const history = await getHistory({
          balancesRepository,
          start: new Date('2020-01-02 18:00:00'),
          end: new Date('2020-01-03 18:30:00'),
        });

        expect(history.length).toBe(1);
        expect(history[0].balance).toBeCloseTo(100);
      });
    });

    describe('given 1w interval', () => {
      beforeEach(async () => {
        await cleanDatabase();
        await useSeeders([DailyWalletBalanceSeeder]);
      });

      it('returns an array with the correct balance', async () => {
        const balancesRepository = getBalancesRepository();
        const history = await getHistory({
          balancesRepository,
          interval: '1w',
        });

        expect(history.length).toBe(2);
        expect(history[0].balance).toBeCloseTo(115.14);
        expect(history[1].balance).toBeCloseTo(70);
      });
    });

    describe('given 1M interval', () => {
      beforeEach(async () => {
        await cleanDatabase();
        await useSeeders([MontlyWalletBalanceSeeder]);
      });

      it('returns an array with the correct balance', async () => {
        const balancesRepository = getBalancesRepository();
        const history = await getHistory({
          balancesRepository,
          interval: '1M',
        });

        expect(history.length).toBe(3);
        expect(history[0].balance).toBeCloseTo(167.5);
        expect(history[1].balance).toBeCloseTo(150);
        expect(history[2].balance).toBeCloseTo(1);
      });
    });

    describe('given 1y interval', () => {
      beforeEach(async () => {
        await cleanDatabase();
        await useSeeders([YearlyWalletBalanceSeeder]);
      });

      it('returns an array with the correct balance', async () => {
        const balancesRepository = getBalancesRepository();
        const history = await getHistory({
          balancesRepository,
          interval: '1y',
        });

        expect(history.length).toBe(2);
        expect(history[0].balance).toBeCloseTo(167.5);
        expect(history[1].balance).toBeCloseTo(100.5);
      });
    });

    describe('given 1h interval', () => {
      beforeEach(async () => {
        await cleanDatabase();
        await useSeeders([HourlyWalletBalanceSeeder]);
      });

      it('returns an array with the correct balance', async () => {
        const balancesRepository = getBalancesRepository();
        const history = await getHistory({
          balancesRepository,
          interval: '1h',
        });

        expect(history.length).toBe(3);
        expect(history[0].balance).toBeCloseTo(150);
        expect(history[1].balance).toBeCloseTo(200);
        expect(history[2].balance).toBeCloseTo(250);
      });
    });
  });
});
