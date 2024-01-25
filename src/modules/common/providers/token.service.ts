import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from 'src/database/redis.service';
import { v4 } from 'uuid';
import { tokenIdKey } from '../constants/token-keys.constant';
import { TokenResponse } from 'src/modules/auth/dto';
import { ConfigService } from '@nestjs/config';
import { TokenDecodeResponse } from '../types';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: CacheService,
    private readonly configService: ConfigService,
  ) {}
  async generateTokenId(identifier: string): Promise<string> {
    if (!identifier) {
      throw new BadRequestException('invalid input');
    }
    const uuid = v4();
    const { name, ttl } = tokenIdKey(uuid);
    await this.redisService.set(name, identifier, ttl);
    return uuid;
  }
  async verifyTokenId(token: string): Promise<string> {
    if (!token) {
      throw new BadRequestException('invalid token');
    }
    const { name } = tokenIdKey(token);
    const existId = await this.redisService.get(name);
    if (existId) {
      await this.redisService.del(name);
      return existId;
    }
    return null;
  }
  async getAuthenticationToken(id: number): Promise<TokenResponse> {
    const accessToken = await this.generateJwtToken(id, '1h');
    const refreshToken = await this.generateJwtToken(id, '24h');
    return {
      accessToken,
      refreshToken,
    };
  }
  async decodeToken(token: string): Promise<TokenDecodeResponse> {
    const decoded = (await this.jwtService.decode(
      token,
    )) as TokenDecodeResponse;

    return decoded;
  }
  async generateJwtToken(identifier: number, exp: string): Promise<string> {
    return await this.jwtService.signAsync(
      { identifier },
      {
        expiresIn: exp,
        secret: this.configService.getOrThrow('auth.jwtSecret'),
      },
    );
  }
}
