import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailDto, LoginDto, RegisterDto, TokenResponse } from './dto';
import { Request, Response } from 'express';
import { IdDto } from 'src/share/dto/id.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { STATUS_CODES } from 'http';

@Controller({
  path: 'auth',
  version: '1',
})
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @ApiConsumes('application/x-www-form-urlencoded')
  async login(@Res() response: Response, @Body() dto: LoginDto) {
    const { accessToken, refreshToken } = await this.authService.login(dto);
    response
      .status(200)
      .cookie('access_token', accessToken, {
        httpOnly: false,
      })
      .cookie('access_token', accessToken, { httpOnly: true })
      .json({
        accessToken,
        refreshToken,
      });
  }
  @Post('register')
  @ApiConsumes('application/x-www-form-urlencoded')
  async register(@Body() dto: RegisterDto): Promise<void> {
    await this.authService.register(dto);
  }
  @Post('verify-email')
  async verifyEmail(@Query() dto: IdDto): Promise<void> {
    await this.authService.verifyEmail(dto.token);
  }
  @Post('resend-verifcation')
  async resendVerification(@Query() { email }: EmailDto): Promise<void> {
    await this.authService.sendVerificationEmail(email);
  }
  @Get('access-token')
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
