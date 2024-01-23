import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT),
  url: process.env.APP_URL,
  hashSaltRounds: parseInt(process.env.HASH_SALT_ROUNDS),
}));
