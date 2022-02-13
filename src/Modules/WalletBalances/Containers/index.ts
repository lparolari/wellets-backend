import { container } from 'tsyringe';

import IWalletBalancesRepository from '../Repositories/IWalletBalancesRepository';
import WalletBalancesRepository from '../Infra/TypeORM/Repositories/WalletBalancesRepository';

container.registerSingleton<IWalletBalancesRepository>(
  'WalletBalancesRepository',
  WalletBalancesRepository,
);
