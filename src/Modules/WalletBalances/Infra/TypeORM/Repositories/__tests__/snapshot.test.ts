import 'dotenv/config';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { createConnection, getConnection, getRepository } from 'typeorm';
import { useSeeders } from '@jorgebodega/typeorm-seeding';

import 'Shared/Containers';
import { RootSeeder } from 'Shared/Infra/TypeORM/Seeds/RootSeeder';
import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';

import WalletBalancesRepository from '../WalletBalancesRepository';
import WalletBalance from '../../Entities/WalletBalance';

beforeAll(async () => {
  await createConnection();
});

beforeEach(async () => {
  await useSeeders([RootSeeder]);
});

afterAll(async () => {
  await getConnection().close();
});

describe('wallet balances repository', () => {
  describe('snapshot', () => {
    test('saves all balances first time', async () => {
      const balancesRepository = container.resolve(WalletBalancesRepository);

      const walletBalancesRepository = getRepository(WalletBalance);
      const walletsRepository = getRepository(Wallet);

      // SUT call
      await balancesRepository.snapshot();

      // Assertions
      const numberOrWallets = await walletsRepository.count();
      const numberOfBalances = await walletBalancesRepository.count();

      const current_balances = (
        await walletsRepository.find({ order: { id: 'ASC' } })
      ).map(wallet => wallet.balance);
      const history_balances = (
        await walletBalancesRepository.find({
          order: { wallet_id: 'ASC' },
        })
      ).map(walletBalance => walletBalance.balance);

      expect(numberOrWallets).toBe(numberOfBalances);
      expect(current_balances).toEqual(history_balances);
    });

    test('saves all balances and keeps old balances values', async () => {
      const balancesRepository = container.resolve(WalletBalancesRepository);

      const walletBalancesRepository = getRepository(WalletBalance);
      const walletsRepository = getRepository(Wallet);

      const updateWalletBalance = async (wallet: Wallet) => {
        return walletsRepository.save({ ...wallet, balance: 123 });
      };
      const getWallet = async (wallet_id: string) => {
        return walletsRepository.findOne({ where: { id: wallet_id } });
      };
      const getBalances = async (wallet_id: string) => {
        return walletBalancesRepository.find({
          where: { wallet_id },
          order: { created_at: 'ASC' },
        });
      };
      const walletId = (await walletsRepository.findOne()).id;
      const firstBalance = (await getWallet(walletId)).balance;

      // SUT call
      await balancesRepository.snapshot();
      await updateWalletBalance(await getWallet(walletId));
      await balancesRepository.snapshot();

      // Assertions
      const numberOrWallets = await walletsRepository.count();
      const numberOfBalances = await walletBalancesRepository.count();

      const balances = (await getBalances(walletId)).map(
        walletBalance => walletBalance.balance,
      );

      expect(numberOrWallets).toBe(numberOfBalances / 2);
      expect(balances.length).toEqual(2);
      expect(balances[0]).toEqual(firstBalance);
      expect(balances[1]).toEqual(123);
    });
  });
});
