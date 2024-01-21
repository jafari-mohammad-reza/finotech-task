import { Module } from '@nestjs/common';
import { ConfigModuleConf, TypeOrmModuleConf } from './share';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModuleConf,
    TypeOrmModuleConf,
    UserModule,
    ProductModule,
    AuthModule,
  ],
})
export class AppModule {}
