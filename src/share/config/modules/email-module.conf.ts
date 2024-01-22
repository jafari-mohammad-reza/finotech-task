import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const EmailModuleConf = MailerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    transport: {
      service: 'gmail',
      from: 'finotech-task',
      auth: {
        user: configService.get('MAILING_USER'),
        pass: configService.get('MAILING_PASSWORD'),
      },
    },
    defaults: {
      from: 'finotech-task',
    },
  }),
});
