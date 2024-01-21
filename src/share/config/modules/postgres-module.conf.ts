import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get('postgres.type'),
      host: this.configService.get('postgres.host'),
      port: this.configService.get('postgres.port'),
      username: this.configService.get('postgres.username'),
      password: this.configService.get('postgres.password'),
      database: this.configService.get('postgres.name'),
      synchronize: this.configService.get('postgres.synchronize'),
      keepConnectionAlive: true,
      logging: this.configService.get('postgres.logging'),
      entities: [join(__dirname, '..', '..', '..', '**', '*.entity{.ts,.js}')],
    } as TypeOrmModuleOptions;
  }
}
