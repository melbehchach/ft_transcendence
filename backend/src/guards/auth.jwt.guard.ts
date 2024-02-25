import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { validateToken } from 'src/helpers/auth.helpers';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const payload = await validateToken(req.cookies['JWT_TOKEN'], this.jwt);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new Error();
      }
      delete user?.password;
      req['user'] = user;
    } catch {
      // console.log('AuthGuard Error');
      throw new UnauthorizedException('Invalid Token');
    }
    return true;
  }
}
