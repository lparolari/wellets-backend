interface ICacheConfig {
  driver: 'null' | 'redis';
  redis?: {
    host: string;
    port: number;
    password: string;
  };
}

export default {
  driver: process.env.CACHE_DRIVER,
  redis: {
    host: process.env.CACHE_REDIS_HOST,
    port: Number(process.env.CACHE_REDIS_PORT),
    password: process.env.CACHE_REDIS_PASSWORD,
  },
} as ICacheConfig;
