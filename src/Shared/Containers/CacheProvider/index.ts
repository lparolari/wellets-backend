import { container } from 'tsyringe';

import ICacheProvider from './Models/ICacheProvider';
import RedisCacheProvider from './Implementations/RedisCacheProvider';
import NullCacheProvider from './Implementations/NullCacheProvider';
import CacheConfig from './Config/CacheConfig';

const drivers = {
  null: NullCacheProvider,
  redis: RedisCacheProvider,
};

container.registerSingleton<ICacheProvider>(
  'CacheProvider',
  drivers[CacheConfig.driver],
);
