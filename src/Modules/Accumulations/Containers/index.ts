import { container } from 'tsyringe';

import IAccumulationsRepository from '../Repositories/IAccumulationsRepository';
import AccumulationsRepository from '../Infra/TypeORM/Repositories/AccumulationsRepository';

container.registerSingleton<IAccumulationsRepository>(
  'AccumulationsRepository',
  AccumulationsRepository,
);
