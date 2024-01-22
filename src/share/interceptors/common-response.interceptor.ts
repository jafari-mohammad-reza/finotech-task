import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { map } from 'rxjs';
import { SuccessResponse } from '../dto';

@Injectable()
export class CommonResponseInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    return next.handle().pipe(
      map((response) => {
        if (
          response instanceof HttpException ||
          response instanceof SuccessResponse
        ) {
          return response;
        }

        return new SuccessResponse(response);
      }),
    );
  }
}
