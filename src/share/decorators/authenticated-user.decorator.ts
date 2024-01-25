import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { TokenEnum } from '../enums';

export const AuthenticatedUser = createParamDecorator(
  (data: TokenEnum, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request.headers['user'];
  },
);
