import { ConfigModule } from '@nestjs/config';
import { Environments } from 'src/share/enums';
import { appConfig, authConfig, postgresConfig, swaggerConf } from '../schemas';

let envFilePath: string;
switch (process.env.NODE_ENV) {
  case Environments.DEVELOP:
    envFilePath = './env/.development.env';
    break;
  case Environments.Seed:
    envFilePath = './env/.seed.env';
    break;
  case Environments.PRODUCTION:
    envFilePath = '.env';
    break;
  default:
    envFilePath = './env/.development.env';
    break;
}

export const ConfigModuleConf = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath,
  load: [appConfig, postgresConfig, authConfig, swaggerConf],
});
