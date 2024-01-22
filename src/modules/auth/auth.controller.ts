import { Controller, Post, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailDto, TokenResponse } from './dto';
import { Request, Response } from 'express';
import { IdDto } from 'src/share/dto/id.dto';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<TokenResponse> {
    return;
  }
  @Post('register')
  async register(): Promise<void> {
    return;
  }
  @Post('verify-email')
  async verifyEmail(@Query() { token }: IdDto): Promise<void> {
    return;
  }
  @Post('resend-verifcation')
  async resendVerification(@Query() { email }: EmailDto): Promise<void> {
    return;
  }
  @Post('access-token')
  async accessToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<TokenResponse> {
    return;
  }
}

//! Tasks
// Login
// Register
// VerifyEmail
// GetAccessToken(by using refresh token)
