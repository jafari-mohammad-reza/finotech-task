import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { User, UserRepository } from '../user/repository';
import { LoginDto, RegisterDto, TokenResponse } from './dto';
import { MailService } from '../email/email.service';
import { TokenService } from '../common/providers/token.service';
import { hash, genSalt, compare } from 'bcryptjs';
import { AuthMessages } from './enum/auth-messages.enum';
import { ConfigService } from '@nestjs/config';
import { UpdateFailed } from 'src/share/exceptions';

@Injectable()
export class AuthService {
  private logger: Logger;
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailerService: MailService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger(AuthService.name);
  }
  async login(dto: LoginDto): Promise<TokenResponse> {
    const { email, password } = dto;
    const existUser = await this.emailExist(email);
    if (!existUser) {
      throw new BadRequestException(AuthMessages.INVALID_CREDENTIALS);
    }
    if (!existUser.isVerified) {
      throw new BadRequestException(AuthMessages.ACCOUNT_NOT_VERIFIED);
    }
    const validPassword = await compare(password, existUser.password);
    if (!validPassword) {
      throw new BadRequestException(AuthMessages.INVALID_CREDENTIALS);
    }
    return await this.tokenService.getAuthenticationToken(existUser.id);
  }
  async register(dto: RegisterDto): Promise<void> {
    const { email, firstName, lastName, password } = dto;
    const isEmailExist = await this.emailExist(email);
    if (isEmailExist) {
      throw new ConflictException(AuthMessages.INVALID_CREDENTIALS);
    }
    const salt = await genSalt(
      await this.configService.get('app.hashSaltRounds'),
    );
    const hashedPassword = await hash(password, salt);
    const createdUser = this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const user = await this.userRepository.save(createdUser);
    if (!user) {
      throw new InternalServerErrorException(AuthMessages.REGISTER_FAILED);
    }
    await this.sendVerificationEmail(email);
  }
  async sendVerificationEmail(email: string) {
    await this.validVerificationEmail(email);
    const appUrl = await this.configService.getOrThrow('app.url');
    const userToken = await this.tokenService.generateTokenId(email);
    this.logger.verbose(`${email} verification token`, userToken);
    const link = `${appUrl}/api/v1/auth/verify-email?token=${userToken}`;
    try {
      await this.mailerService.sendEmail(
        email,
        'please verify your account',
        link,
      );
    } catch (err) {
      this.logger.error(`Fail to send verification email to ${email}`);
    }
  }
  async verifyEmail(token: string) {
    const tokenEmail = await this.tokenService.verifyTokenId(token);
    if (!tokenEmail) {
      throw new BadRequestException(AuthMessages.INVALID_TOKEN);
    }
    const user = await this.emailExist(tokenEmail);
    if (!user) {
      throw new BadRequestException(AuthMessages.INVALID_TOKEN);
    }
    const result = await this.userRepository.verifyUser(user);
    if (!result) {
      throw new UpdateFailed();
    }
  }
  async getAccessToken(refreshToken: string): Promise<string> {
    if (!refreshToken) {
      throw new NotFoundException(AuthMessages.REFRESH_TOKEN_NOT_EXIST);
    }
    const { identifier, exp } =
      await this.tokenService.decodeToken(refreshToken);

    if (new Date(exp * 1000) <= new Date()) {
      throw new BadRequestException(AuthMessages.INVALID_TOKEN);
    }
    return await this.tokenService.generateJwtToken(
      identifier as number,
      '30m',
    );
  }
  async validVerificationEmail(email: string): Promise<void> {
    const existUser = await this.emailExist(email);
    if (!existUser || existUser.isVerified) {
      throw new BadRequestException(AuthMessages.INVALID_EMAIL);
    }
  }
  async emailExist(email: string): Promise<User> {
    return await this.userRepository.findByEmail(email);
  }
}
