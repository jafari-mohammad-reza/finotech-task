import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function SwaggerConf(
  app: INestApplication,
  configService: ConfigService,
) {
  const options = new DocumentBuilder()
    .setTitle('Finotech API')
    .setVersion('1.0.0')
    .addBasicAuth(
      { name: 'authorization', type: 'http', scheme: 'Bearer' },
      'authorization',
    )
    .addCookieAuth(
      'authorization',
      {
        type: 'http',
        in: 'Header',
        scheme: 'Bearer',
      },
      'authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(configService.get('swagger.url'), app, document);
}
