import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  jwtSecret: process.env.AUTH_JWT_SECRET,
  jwtPrivateKeyPath: process.env.AUTH_JWT_PRIVATE_KEY_PATH,
  jwtPublicKeyPath: process.env.AUTH_JWT_PUBLIC_KEY_PATH,
}));
