import 'Shared/Containers';

import ITimeBalanceDTO from 'Modules/Assets/DTOs/ITimeBalanceDTO';
import IAssetsRepository from 'Modules/Assets/Repositories/IAssetsRepository';
import Currency from 'Modules/Currencies/Infra/TypeORM/Entities/Currency';
import Transaction from 'Modules/Transactions/Infra/TypeORM/Entities/Transaction';
import User from 'Modules/Users/Infra/TypeORM/Entities/User';
import Wallet from 'Modules/Wallets/Infra/TypeORM/Entities/Wallet';
import { container } from 'tsyringe';
import { getRepository } from 'typeorm';

import Asset from '../../Entities/Asset';
import AssetEntry from '../../Entities/AssetEntry';

export const USER_ID = 'f3156082-d35e-4fdd-a98b-f0e151b08bc3';
export const CURRENCY_ID = 'ca075633-c843-4502-8790-dba18a8191ef';
export const ASSET_ID = 'cc41a557-3612-4173-a19e-a71b19cec75b';
export const WALLET_ID = 'a9b0f5a1-0b1d-4b0f-8c1c-8c1c8c1c8c1c';
export const TRANSACTION_ID = 'b9b0f5a1-0b1d-4b0f-8c1c-8c1c8c1c8c1c';

export const getAssetsRepository = (): IAssetsRepository =>
  container.resolve<IAssetsRepository>('AssetsRepository');

export const getHistory = async ({
  assetsRepository,
  interval,
  start,
  end,
}: {
  assetsRepository: IAssetsRepository;
  interval?: string;
  start?: Date;
  end?: Date;
}): Promise<ITimeBalanceDTO[]> =>
  assetsRepository.history({
    asset_id: ASSET_ID,
    interval: (interval as '1h' | '1d' | '1w' | '1M' | '1y') || '1d',
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

export const mkAsset = async (): Promise<Asset> => {
  const assetsRepository = getRepository(Asset);
  return assetsRepository.save(
    assetsRepository.create({
      id: ASSET_ID,
      currency_id: CURRENCY_ID,
      user_id: USER_ID,
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

export const mkTransaction = async (): Promise<Transaction> => {
  const transactionsRepository = getRepository(Transaction);
  return transactionsRepository.save(
    transactionsRepository.create({
      id: TRANSACTION_ID,
      wallet_id: WALLET_ID,
      description: 'foo',
      value: 100,
    }),
  );
};

export const mkEntry = async ({
  value,
  created_at,
}: {
  value: number;
  created_at: Date;
}): Promise<AssetEntry> => {
  const assetsEntriesRepository = getRepository(AssetEntry);
  return assetsEntriesRepository.save(
    assetsEntriesRepository.create({
      value,
      created_at,
      dollar_rate: 1,
      asset_id: ASSET_ID,
      transaction_id: TRANSACTION_ID, // workaround: every entry should have a different transaction
    }),
  );
};
