import { Module } from '@nestjs/common';
import { ConfigModuleConf, TypeOrmModuleConf } from './share';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModuleConf } from './share/config/modules/redis-module.conf';

@Module({
  imports: [
    ConfigModuleConf,
    TypeOrmModuleConf,
    RedisModuleConf,
    UserModule,
    ProductModule,
    AuthModule,
  ],
})
export class AppModule {}
