import { Module } from '@nestjs/common';
import { EmailModuleConf } from 'src/share/config/modules/email-module.conf';
import { MailService } from './email.service';

@Module({
  imports: [EmailModuleConf],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
