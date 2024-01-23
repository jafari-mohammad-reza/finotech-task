import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from 'src/database/redis.service';
import { v4 } from 'uuid';
import { tokenIdKey } from '../constants/token-keys.constant';
@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: CacheService,
  ) {}
  async generateTokenId(identifier: string): Promise<string> {
    const uuid = v4();
    const { name, ttl } = tokenIdKey(uuid);
    await this.redisService.set(name, identifier, ttl);
    return uuid;
  }
  async verifyTokenId(token: string): Promise<string> {
    const { name } = tokenIdKey(token);
    const existId = await this.redisService.get(name);
    if (existId) {
      await this.redisService.del(name);
      return existId;
    }
    return null;
  }
}
