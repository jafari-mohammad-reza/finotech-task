import { registerAs } from '@nestjs/config';
export const postgresConfig = registerAs('postgres', () => ({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  name: process.env.POSTGRES_DB,
  synchronize: process.env.NODE_ENV == 'development',
  rejectUnauthorized: 'true',
}));
