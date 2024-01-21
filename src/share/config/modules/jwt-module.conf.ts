import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';
export const JwtModuleConf = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    privateKey: readFileSync(
      join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        config.getOrThrow('auth.jwtPrivateKeyPath'),
      ),
      {
        encoding: 'utf-8',
      },
    ),
    publicKey: readFileSync(
      join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        config.getOrThrow('auth.jwtPublicKeyPath'),
      ),
      {
        encoding: 'utf-8',
      },
    ),
    signOptions: { algorithm: 'RS256' },
  }),
});