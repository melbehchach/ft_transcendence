import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { validateToken } from 'src/helpers/auth.helpers';

@Injectable()
export class ChatGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const payload = await validateToken(req.cookies['JWT_TOKEN'], this.jwt);
      const user = await this.prisma.user.findUnique({
        where: {
          email: payload.email,
        },
        select: {
          id: true,
        },
      });
      req['userID'] = user?.id;
    } catch {
      throw new UnauthorizedException('Invalid Token');
    }
    return true;
  }
}
