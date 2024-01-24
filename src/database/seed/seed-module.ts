import { Module } from '@nestjs/common';

import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModuleConf, TypeOrmModuleConf } from '../../share';
import { UserSeedModule } from './user/user-seed.module';
import { ProductSeedModule } from './product/product-seed.module';

@Module({
  imports: [
    ConfigModuleConf,
    TypeOrmModuleConf,
    UserSeedModule,
    ProductSeedModule,
  ],
})
export class SeedModule {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
}
