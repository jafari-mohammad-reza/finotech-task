import { registerAs } from '@nestjs/config';

export const swaggerConf = registerAs('swagger', () => ({
  url: process.env.SWAGGER_URL,
}));
