import { container } from 'tsyringe';

import IPortfoliosRepository from '../Repositories/IPortfoliosRepository';
import PortfoliosRepository from '../Infra/TypeORM/Repositories/PortfoliosRepository';

container.registerSingleton<IPortfoliosRepository>(
  'PortfoliosRepository',
  PortfoliosRepository,
);
