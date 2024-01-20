import { Module } from '@nestjs/common';
import { ConfigModuleConf, TypeOrmModuleConf } from './share';

@Module({
  imports: [ConfigModuleConf, TypeOrmModuleConf],
  controllers: [],
  providers: [],
})
export class AppModule {}
