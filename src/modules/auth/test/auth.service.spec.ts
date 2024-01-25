import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User, UserRepository } from 'src/modules/user/repository';
import { MailService } from 'src/modules/email/email.service';
import { TokenService } from 'src/modules/common/providers';
import { MailModule } from 'src/modules/email/email.module';
import { CommonModule } from 'src/modules/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModuleConf, TypeOrmModuleConf } from 'src/share';
import { RedisModuleConf } from 'src/share/config/modules/redis-module.conf';
import { LoginDto, RegisterDto } from '../dto';
import { AuthMessages } from '../enum/auth-messages.enum';
import { genSaltSync, hashSync } from 'bcryptjs';
import { UpdateFailed } from 'src/share/exceptions';

describe('AuthService', () => {
  let authService: AuthService;
  let mailerService: MailService;
  let tokenService: TokenService;
  let userRepository: UserRepository;

  const userRepositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
    findByEmail: jest.fn(),
    verifyUser: jest.fn(),
  };
  const mailServiceMock = {
    sendEmail: jest.fn(),
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
        RedisModuleConf,
        TypeOrmModule.forFeature([User]),
        CommonModule,
        MailModule,
      ],
      providers: [AuthService, UserRepository, ConfigService],
    })
      .overrideProvider(UserRepository)
      .useValue(userRepositoryMock)
      .overrideProvider(MailService)
      .useValue(mailServiceMock)
      .overrideProvider(TokenService)
      .useValue(tokenServiceMock)

      .compile();

    authService = module.get<AuthService>(AuthService);
    mailerService = module.get<MailService>(MailService);
    userRepository = module.get<UserRepository>(UserRepository);
    tokenService = module.get<TokenService>(TokenService);
  });

  describe('login', () => {
    const dto = new LoginDto();
    dto.email = 'admin@gmail.com';
    dto.password = 'Admin123';

    const validPassword = hashSync(
      dto.password,
      genSaltSync(parseInt(process.env.HASH_SALT_ROUNDS)),
    );
    const invalidPassword = hashSync(
      'InvalidPassword',
      genSaltSync(parseInt(process.env.HASH_SALT_ROUNDS)),
    );

    it('shoudl login seccessfully and get token', async () => {
      userRepositoryMock.findByEmail.mockResolvedValue({
        email: 'admin@gmail.com',
        password: validPassword,
        isVerified: true,
      });
      tokenServiceMock.getAuthenticationToken.mockResolvedValue({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
      const result = await authService.login(dto);
      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });
    it('shoudl fail as email not exist', async () => {
      userRepositoryMock.findByEmail.mockResolvedValue(null);
      await expect(authService.login(dto)).rejects.toThrow(BadRequestException);
      await expect(authService.login(dto)).rejects.toMatchObject({
        message: AuthMessages.INVALID_CREDENTIALS,
      });
    });
    it('shoudl fail as account is not verfied', async () => {
      userRepositoryMock.findByEmail.mockResolvedValue({
        email: 'admin@gmail.com',
        password: validPassword,
        isVerified: false,
      });
      await expect(authService.login(dto)).rejects.toThrow(BadRequestException);
      await expect(authService.login(dto)).rejects.toMatchObject({
        message: AuthMessages.ACCOUNT_NOT_VERIFIED,
      });
    });
    it('shoudl fail as invalid password', async () => {
      userRepositoryMock.findByEmail.mockResolvedValue({
        email: 'admin@gmail.com',
        password: invalidPassword,
        isVerified: true,
      });
      await expect(authService.login(dto)).rejects.toThrow(BadRequestException);
      await expect(authService.login(dto)).rejects.toMatchObject({
        message: AuthMessages.INVALID_CREDENTIALS,
      });
    });
  });
  describe('register', () => {
    const dto = new RegisterDto();
    dto.firstName = 'Admin';
    dto.lastName = 'Admin lastname';
    dto.email = 'admin@gmail.com';
    dto.password = 'Admin123';
    it('should register successfully', async () => {
      userRepositoryMock.findByEmail
        .mockResolvedValueOnce(null)
        .mockResolvedValue(dto);

      userRepositoryMock.create.mockReturnValue(dto);
      userRepositoryMock.save.mockResolvedValue(dto);

      const sendVerificationEmailSpy = jest.spyOn(
        authService,
        'sendVerificationEmail',
      );

      await authService.register(dto);

      expect(sendVerificationEmailSpy).toHaveBeenCalledWith(dto.email);
    });

    it('should fail as email already exists', async () => {
      userRepositoryMock.findByEmail.mockResolvedValue({
        email: 'admin@gmail.com',
        password: 'somePassword',
      });

      await expect(authService.register(dto)).rejects.toThrow(
        ConflictException,
      );
      await expect(authService.register(dto)).rejects.toMatchObject({
        message: AuthMessages.INVALID_CREDENTIALS,
      });
    });
    it('should fail as no user got saved', async () => {
      userRepositoryMock.findByEmail.mockResolvedValue(null);
      userRepositoryMock.save.mockResolvedValue(null);

      await expect(authService.register(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(authService.register(dto)).rejects.toMatchObject({
        message: AuthMessages.REGISTER_FAILED,
      });
    });
  });
  describe('verifyEmail', () => {
    it('should throw BadRequestException if tokenEmail is null', async () => {
      tokenServiceMock.verifyTokenId.mockResolvedValue(null);

      await expect(authService.verifyEmail('invalidToken')).rejects.toThrow(
        BadRequestException,
      );
      expect(tokenServiceMock.verifyTokenId).toHaveBeenCalledWith(
        'invalidToken',
      );
    });

    it('should fail as if user is not found', async () => {
      tokenServiceMock.verifyTokenId.mockResolvedValue('validEmail');
      userRepositoryMock.findByEmail.mockResolvedValue(null);

      await expect(authService.verifyEmail('validToken')).rejects.toThrow(
        BadRequestException,
      );
      expect(tokenServiceMock.verifyTokenId).toHaveBeenCalledWith('validToken');
      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith('validEmail');
    });

    it('should fail as  if verifyUser returns false', async () => {
      tokenServiceMock.verifyTokenId.mockResolvedValue('validEmail');
      userRepositoryMock.findByEmail.mockResolvedValue({});
      userRepositoryMock.verifyUser.mockResolvedValue(false);

      await expect(authService.verifyEmail('validToken')).rejects.toThrow(
        UpdateFailed,
      );
      expect(tokenServiceMock.verifyTokenId).toHaveBeenCalledWith('validToken');
      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith('validEmail');
      expect(userRepositoryMock.verifyUser).toHaveBeenCalledWith({});
    });

    it('should success', async () => {
      tokenServiceMock.verifyTokenId.mockResolvedValue('validEmail');
      userRepositoryMock.findByEmail.mockResolvedValue({});
      userRepositoryMock.verifyUser.mockResolvedValue(true);

      await expect(
        authService.verifyEmail('validToken'),
      ).resolves.not.toThrow();
      expect(tokenServiceMock.verifyTokenId).toHaveBeenCalledWith('validToken');
      expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith('validEmail');
      expect(userRepositoryMock.verifyUser).toHaveBeenCalledWith({});
    });
  });
  describe('getAccessToken', () => {
    it('should fail as if refreshToken is empty', async () => {
      const emptyRefreshToken = '';

      await expect(
        authService.getAccessToken(emptyRefreshToken),
      ).rejects.toThrow(NotFoundException);
      expect(tokenServiceMock.decodeToken).not.toHaveBeenCalled();
      expect(tokenServiceMock.generateJwtToken).not.toHaveBeenCalled();
    });

    it('should fail if refreshToken is expired', async () => {
      const expiredRefreshToken = 'expiredToken';
      const decodedToken = {
        identifier: 1,
        exp: Math.floor(Date.now() / 1000) - 3600, // Set the expiration to the past (expired)
      };

      tokenServiceMock.decodeToken.mockResolvedValue(decodedToken);

      await expect(
        authService.getAccessToken(expiredRefreshToken),
      ).rejects.toThrow(BadRequestException);
      expect(tokenServiceMock.decodeToken).toHaveBeenCalledWith(
        expiredRefreshToken,
      );
      expect(tokenServiceMock.generateJwtToken).not.toHaveBeenCalled();
    });

    it('should succeed', async () => {
      const validRefreshToken = 'validToken';
      const decodedToken = {
        identifier: 1,
        exp: Math.floor(Date.now() / 1000) + 3600,
      };
      const generatedAccessToken = 'newAccessToken';

      tokenServiceMock.decodeToken.mockResolvedValue(decodedToken);
      tokenServiceMock.generateJwtToken.mockResolvedValue(generatedAccessToken);

      const result = await authService.getAccessToken(validRefreshToken);

      expect(tokenServiceMock.decodeToken).toHaveBeenCalledWith(
        validRefreshToken,
      );
      expect(tokenServiceMock.generateJwtToken).toHaveBeenCalledWith(
        decodedToken.identifier,
        '30m',
      );
      expect(result).toEqual(generatedAccessToken);
    });
  });
});
