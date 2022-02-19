import IORedis, { Redis } from 'ioredis';

import ICacheConfig from '../Config/CacheConfig';
import ICacheProvider from '../Models/ICacheProvider';

class RedisCacheProvider implements ICacheProvider {
  private redisClient: Redis;

  constructor() {
    const { redis } = ICacheConfig;

    this.redisClient = new IORedis({
      host: redis.host,
      port: redis.port,
      password: redis.password,
    });
  }

  public async save<T>(key: string, value: T, expires = 2 * 60): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(value), 'ex', expires);
  }

  public async find<T>(key: string): Promise<T | null> {
    const value = await this.redisClient.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  }

  public async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  public async deleteByPrefix(prefix: string): Promise<void> {
    const keys = await this.redisClient.keys(`${prefix}:*`);

    const pipeline = this.redisClient.pipeline();

    keys.forEach(key => {
      pipeline.del(key);
    });

    await pipeline.exec();
  }
}

export default RedisCacheProvider;
