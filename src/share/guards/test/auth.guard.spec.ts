import { TokenService } from 'src/modules/common/providers';
import { User, UserRepository } from 'src/modules/user/repository';
import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModuleConf, TypeOrmModuleConf } from 'src/share/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from '../auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  const userRepositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
    findByEmail: jest.fn(),
    verifyUser: jest.fn(),
  };

  const tokenServiceMock = {
    getAuthenticationToken: jest.fn(),
    generateTokenId: jest.fn(),
    verifyTokenId: jest.fn(),
    decodeToken: jest.fn(),
    generateJwtToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModuleConf,
        TypeOrmModuleConf,
        TypeOrmModule.forFeature([User]),
      ],
      providers: [AuthGuard, TokenService, UserRepository],
    })
      .overrideProvider(UserRepository)
      .useValue(userRepositoryMock)
      .overrideProvider(TokenService)
      .useValue(tokenServiceMock)
      .compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
  });
  it('guard should be defined', () => {
    expect(authGuard).toBeDefined();
  });
});
