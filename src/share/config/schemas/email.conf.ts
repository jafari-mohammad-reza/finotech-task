import { registerAs } from '@nestjs/config';

export const EmailConf = registerAs('email', () => ({
  emailUser: process.env.MAILING_USER,
  emailPassword: process.env.MAILING_PASSWORD,
}));
