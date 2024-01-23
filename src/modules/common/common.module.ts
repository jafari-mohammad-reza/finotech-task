import { Module } from '@nestjs/common';
import { JwtModuleConf } from '../../share/config/modules/jwt-module.conf';
import { TokenService } from './providers/token.service';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from 'src/database/redis.service';

@Module({
  imports: [JwtModuleConf],
  providers: [TokenService, JwtService, CacheService],
  exports: [TokenService],
})
export class CommonModule {}
