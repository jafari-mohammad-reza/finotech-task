import { Test } from '@nestjs/testing';
import { JwtModuleConf } from '../../../share/config/modules/jwt-module.conf';
import { TokenService } from '../providers';
import { JwtService } from '@nestjs/jwt';
import { CacheService } from '../../../database/redis.service';
import { ConfigModuleConf } from '../../../share/config/modules/config-module.conf';
import { RedisModuleConf } from 'src/share/config/modules/redis-module.conf';
import { BadRequestException } from '@nestjs/common';
let tokenService: TokenService;
let cacheService: CacheService;
const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
};
const jwtServiceMock = {
  signAsync: jest.fn().mockResolvedValue('mockedToken'),
  decode: jest.fn(),
};

describe('Token service spec', function () {
  beforeEach(async () => {
    const testModule = await Test.createTestingModule({
      imports: [ConfigModuleConf, JwtModuleConf, RedisModuleConf],
      providers: [TokenService, JwtService, CacheService],
      exports: [TokenService],
    })
      .overrideProvider(CacheService)
      .useValue(mockCacheService)
      .overrideProvider(JwtService)
      .useValue(jwtServiceMock)
      .compile();
    tokenService = testModule.get<TokenService>(TokenService);
    cacheService = testModule.get<CacheService>(CacheService);
  });
  it('should be defined', () => {
    expect(tokenService).toBeDefined();
  });

  it('should handle Redis service failure', async () => {
    mockCacheService.get.mockRejectedValue(new Error('Redis error'));

    await expect(tokenService.verifyTokenId('validToken')).rejects.toThrow(
      'Redis error',
    );
  });
  describe('generateTokenId', () => {
    it('should generate a UUID and store it in Redis', async () => {
      const identifier = 'testIdentifier';
      const uuid = await tokenService.generateTokenId(identifier);
      expect(uuid).toBeDefined();

      expect(cacheService.set).toHaveBeenCalledWith(
        expect.any(String),
        identifier,
        expect.any(Number),
      );
    });

    it('should handle invalid input', async () => {
      await expect(tokenService.generateTokenId(null)).rejects.toThrow();
    });
  });
  describe('verifyTokenId', () => {
    it('should verify a token and return the associated identifier', async () => {
      const token = 'validToken';
      const expectedIdentifier = 'identifier';
      mockCacheService.get.mockResolvedValue(expectedIdentifier);

      const result = await tokenService.verifyTokenId(token);

      expect(result).toBe(expectedIdentifier);
      expect(cacheService.get).toHaveBeenCalledWith(expect.any(String));
      expect(cacheService.del).toHaveBeenCalledWith(expect.any(String));
    });

    it('should return null if token is not found', async () => {
      mockCacheService.get.mockResolvedValue(null);

      const result = await tokenService.verifyTokenId('invalidToken');

      expect(result).toBeNull();
    });

    it('should throw BadRequestException for invalid token input', async () => {
      await expect(tokenService.verifyTokenId(null)).rejects.toThrow(
        BadRequestException,
      );
      await expect(tokenService.verifyTokenId('')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
  describe('generateJwtToken', () => {
    it('should generate a token for a valid identifier and expiration', async () => {
      const identifier = 123;
      const exp = '1h';
      jwtServiceMock.signAsync.mockResolvedValue('mockedToken');
      const token = await tokenService.generateJwtToken(identifier, exp);
      expect(token).toBeDefined();
      expect(token).toBe('mockedToken');
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(
        { identifier },
        expect.objectContaining({ expiresIn: exp, secret: 'someSecret' }),
      );
    });
  });
  describe('decodeToken', () => {
    it('should successfully decode a valid token', async () => {
      const mockToken = 'mockToken';
      const mockDecoded = { identifier: 123 };
      jwtServiceMock.decode.mockReturnValue(mockDecoded);

      const result = await tokenService.decodeToken(mockToken);

      expect(jwtServiceMock.decode).toHaveBeenCalledWith(mockToken);
      expect(result).toEqual(mockDecoded);
    });

    it('should handle an invalid token', async () => {
      const mockToken = 'invalidToken';
      jwtServiceMock.decode.mockReturnValue(null);

      const result = await tokenService.decodeToken(mockToken);

      expect(jwtServiceMock.decode).toHaveBeenCalledWith(mockToken);
      expect(result).toBeNull();
    });
  });
});
