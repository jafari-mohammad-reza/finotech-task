// this code will decode authenticated user as pass its id as parameter in header
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from 'src/modules/common/providers';

@Injectable()
export class AuthenticatedUserInterceptor implements NestInterceptor {
  constructor(private readonly tokenService: TokenService) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request: Request = context.switchToHttp().getRequest();
    const token =
      request.headers['access_token'] || request.cookies['access_token'];
    const { identifier } = await this.tokenService.decodeToken(token);
    request.headers['user'] = String(identifier);
    return next.handle();
  }
}
