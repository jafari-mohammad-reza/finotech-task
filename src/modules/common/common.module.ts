import { Module } from '@nestjs/common';
import { JwtModuleConf } from '../../share/config/modules/jwt-module.conf';
import { TokenService } from './providers/token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [JwtModuleConf],
  providers: [TokenService , JwtService],
  exports: [TokenService],
})
export class CommonModule {}
