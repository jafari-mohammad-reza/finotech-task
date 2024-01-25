import { Test } from '@nestjs/testing';
import { JwtModuleConf } from '../../../share/config/modules/jwt-module.conf';
import { TokenService } from '../providers';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '../../../database/redis.service';
import { ConfigModuleConf } from '../../../share/config/modules/config-module.conf';
let tokenService: TokenService;
describe('Token service spec', function () {
  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      imports: [ConfigModuleConf, JwtModuleConf],
      providers: [TokenService, JwtService, CacheService],
      exports: [TokenService],
    }).compile();
    tokenService = testModule.get<TokenService>(TokenService);
  });
  it('should be defined', () => {
    expect(tokenService).toBeDefined();
  });
});
