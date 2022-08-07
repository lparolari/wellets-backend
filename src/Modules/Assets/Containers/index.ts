import { container } from 'tsyringe';

import IAssetsRepository from '../Repositories/IAssetsRepository';
import AssetsRepository from '../Infra/TypeORM/Repositories/AssetsRepository';

container.registerSingleton<IAssetsRepository>(
  'AssetsRepository',
  AssetsRepository,
);
