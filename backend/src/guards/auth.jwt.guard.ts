import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { validateToken } from 'src/helpers/auth.helpers';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private reflector: Reflector,
    private authservice: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.debug('[AUTHGUARD]');
    const req = context.switchToHttp().getRequest();
    try {
      const payload = await validateToken(req.cookies['JWT_TOKEN'], this.jwt);
      const { username, email, avatar, isAuthenticated } =
        await this.authservice.findUser(payload.email);
      req['user'] = {
        username,
        email,
        avatar,
        isAuthenticated,
      };
    } catch {
      throw new UnauthorizedException('Invalid Token');
    }
    return true;
  }
}
