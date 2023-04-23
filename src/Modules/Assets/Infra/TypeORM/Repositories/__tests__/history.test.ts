import 'dotenv/config';
import 'reflect-metadata';
import 'Shared/Containers';

import cleanDatabase from 'Shared/Infra/TypeORM/cleanDatabase';
import { createConnection, getConnection } from 'typeorm';

import { useSeeders } from '@jorgebodega/typeorm-seeding';

import { getAssetsRepository, getHistory } from './utils';
// import DailyWalletBalanceSeeder from './Seeders/DailyWalletBalanceSeeder';
// import MontlyWalletBalanceSeeder from './Seeders/MontlyWalletBalanceSeeder';
// import YearlyWalletBalanceSeeder from './Seeders/YearlyWalletBalanceSeeder';
// import HourlyWalletBalanceSeeder from './Seeders/HourlyWalletBalanceSeeder';
import AssetSeeder from './Seeders/AssetSeeder';

beforeAll(async () => {
  await createConnection();
});

afterAll(async () => {
  await getConnection().close();
});

describe('assets repository', () => {
  describe('history', () => {
    describe('given 1d interval', () => {
      beforeEach(async () => {
        await cleanDatabase();
        await useSeeders([AssetSeeder]);
      });

      it('returns an array', async () => {
        const assetsRepository = getAssetsRepository();
        const history = await getHistory({ assetsRepository });

        expect(history).toBeInstanceOf(Array);
      });

      it('returns correct number of groups by date', async () => {
        const assetsRepository = getAssetsRepository();
        const history = await getHistory({ assetsRepository });

        expect(history.length).toBe(5);
      });

      it('returns an array of balances', async () => {
        const assetsRepository = getAssetsRepository();
        const history = await getHistory({ assetsRepository });

        expect(history[0]).toHaveProperty('timestamp');
        expect(history[0]).toHaveProperty('balance');
      });

      it('returns an array sorted by timestamp', async () => {
        const assetsRepository = getAssetsRepository();
        const history = await getHistory({ assetsRepository });

        for (const h of history) {
          expect(new Date(h.timestamp).getTime()).toBeLessThanOrEqual(
            new Date(h.timestamp).getTime(),
          );
        }
      });

      it('returns an array with the correct balance', async () => {
        const assetsRepository = getAssetsRepository();
        const history = await getHistory({ assetsRepository });

        expect(history[0].balance).toBeCloseTo(300);
        expect(history[1].balance).toBeCloseTo(700);
        expect(history[2].balance).toBeCloseTo(601);
        expect(history[3].balance).toBeCloseTo(606);
        expect(history[4].balance).toBeCloseTo(676);
      });

      it('returns balances filtered by start date', async () => {
        const assetsRepository = getAssetsRepository();
        const history = await getHistory({
          assetsRepository,
          start: new Date('2020-01-02 15:00:00'),
        });

        expect(history.length).toBe(3);
        expect(history[0].balance).toBeCloseTo(601);
        expect(history[1].balance).toBeCloseTo(606);
        expect(history[2].balance).toBeCloseTo(676);
      });

      it('returns balances filtered by end date', async () => {
        const assetsRepository = getAssetsRepository();
        const history = await getHistory({
          assetsRepository,
          end: new Date('2020-01-02 15:30:00'),
        });

        expect(history.length).toBe(2);
        expect(history[0].balance).toBeCloseTo(300);
        expect(history[1].balance).toBeCloseTo(700);
      });

      it('returns balances filtered by start and end date', async () => {
        const assetsRepository = getAssetsRepository();
        const history = await getHistory({
          assetsRepository,
          start: new Date('2020-01-02 18:00:00'),
          end: new Date('2020-01-03 18:30:00'),
        });

        expect(history.length).toBe(1);
        expect(history[0].balance).toBeCloseTo(601);
      });
    });

    describe('given 1w interval', () => {
      beforeEach(async () => {
        await cleanDatabase();
        await useSeeders([AssetSeeder]);
      });

      it('returns correct number of groups by date', async () => {
        const assetsRepository = getAssetsRepository();
        const history = await getHistory({
          assetsRepository,
          interval: '1w',
        });

        expect(history.length).toBe(2);
      });
    });

    describe('given 1M interval', () => {
      beforeEach(async () => {
        await cleanDatabase();
        await useSeeders([AssetSeeder]);
      });

      it('returns correct number of groups by date', async () => {
        const assetsRepository = getAssetsRepository();
        const history = await getHistory({
          assetsRepository,
          interval: '1M',
        });

        expect(history.length).toBe(1);
      });
    });

    describe('given 1y interval', () => {
      beforeEach(async () => {
        await cleanDatabase();
        await useSeeders([AssetSeeder]);
      });

      it('returns correct number of groups by date', async () => {
        const assetsRepository = getAssetsRepository();
        const history = await getHistory({
          assetsRepository,
          interval: '1y',
        });

        expect(history.length).toBe(1);
      });
    });

    describe('given 1h interval', () => {
      beforeEach(async () => {
        await cleanDatabase();
        await useSeeders([AssetSeeder]);
      });

      it('returns correct number of groups by date', async () => {
        const assetsRepository = getAssetsRepository();
        const history = await getHistory({
          assetsRepository,
          interval: '1h',
        });

        expect(history.length).toBe(7);
      });
    });
  });
});
