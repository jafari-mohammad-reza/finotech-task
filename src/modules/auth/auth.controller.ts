import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailDto, LoginDto, RegisterDto } from './dto';
import { Response } from 'express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { AuthToken } from 'src/share';
import { TokenEnum } from 'src/share';
import { TokenIdDto } from 'src/share';

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
      .status(HttpStatus.OK)
      .cookie('access_token', accessToken, {
        httpOnly: false,
      })
      .cookie('refresh_token', refreshToken, { httpOnly: true })
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
  async verifyEmail(@Query() dto: TokenIdDto): Promise<void> {
    await this.authService.verifyEmail(dto.token);
  }
  @Post('resend-verifcation')
  async resendVerification(@Query() { email }: EmailDto): Promise<void> {
    await this.authService.sendVerificationEmail(email);
  }
  @Get('access-token')
  async accessToken(
    @AuthToken(TokenEnum.RefreshToken) refreshToken: string,
    @Res() response: Response,
  ) {
    const accessToken = await this.authService.getAccessToken(refreshToken);

    return response
      .status(HttpStatus.OK)
      .cookie('access_token', accessToken, { httpOnly: true })
      .json({ accessToken });
  }
}

//! Tasks
// Login
// Register
// VerifyEmail
// GetAccessToken(by using refresh token)
