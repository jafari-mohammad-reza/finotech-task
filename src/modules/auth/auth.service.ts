import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/repository';
import { LoginDto, RegisterDto, TokenResponse } from './dto';
import { MailerService } from '@nestjs-modules/mailer';
import { TokenService } from '../common/providers/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailerService: MailerService,
    private readonly tokenService: TokenService,
  ) {}
  async login(dto: LoginDto): Promise<TokenResponse> {
    return;
  }
  async register(dto: RegisterDto): Promise<void> {
    return;
  }
  async sendVerificationEmail(email: string) {}
  async verifyEmail(token: string) {}
  async getAccessToken(refreshToken: string): Promise<string> {
    return;
  }
}
