import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { TokenService } from 'src/modules/common/providers';
import { UserRepository } from 'src/modules/user/repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepository: UserRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token =
      request.headers['access_token'] || request.cookies['access_token'];
    if (!token) {
      return false;
    }
    const { identifier, exp } = await this.tokenService.decodeToken(token);
    if (new Date(exp * 1000) <= new Date()) {
      return false;
    }
    const user = await this.userRepository.findOneById(identifier);
    if (!user) {
      return false;
    }
    return true;
  }
}
