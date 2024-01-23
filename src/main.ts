import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { CommonResponseInterceptor, Environments, SwaggerConf } from './share';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService);
  const env = configService.get('app.env');
  app.use(cookieParser());
  app.enableShutdownHooks();
  app.setGlobalPrefix('/api', {
    exclude: ['/'],
  });
  app.enableVersioning({
    prefix: 'v',
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.useGlobalInterceptors(new CommonResponseInterceptor());
  if (env !== Environments.PRODUCTION) {
    SwaggerConf(app, configService);
  }
  await app.listen(configService.get('app.port'));
}
bootstrap();
