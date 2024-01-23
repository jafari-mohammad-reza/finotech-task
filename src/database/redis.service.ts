import { Injectable } from '@nestjs/common';
import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  constructor(@InjectRedis(DEFAULT_REDIS_NAMESPACE) readonly redis: Redis) {}

  async get(key: string): Promise<any> {
    return JSON.parse(await this.redis.get(key));
  }

  async set(key: string, value: string, ttl?: number): Promise<any> {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
