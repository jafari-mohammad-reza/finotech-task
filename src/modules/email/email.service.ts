import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendEmail(to: string, subject: string, content: any) {
    await this.mailerService.sendMail({
      from: 'mohammadrezajafari.dev@gmail.com',
      to,
      subject,
      html: `<body>${content}</body>`,
    });
  }
}
