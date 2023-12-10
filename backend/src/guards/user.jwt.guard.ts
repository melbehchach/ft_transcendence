import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { validateToken } from 'src/helpers/auth.helpers';
import { Status } from '@prisma/client';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const payload = await validateToken(req.cookies['JWT_TOKEN'], this.jwt);
      const user = await this.prisma.user.findFirst({
        where: {
          email: payload.email,
        },
        include: {
          friends: { select: { username: true } },
          sentRequests: { where: { status: Status.PENDING } },
          receivedRequests: { where: { status: Status.PENDING } },
          sentMessages: {
            select: {
              id: true,
              receiver: { select: { username: true } },
              body: true,
              Chat: {
                select: {
                  id: true,
                  users: { select: { username: true } },
                },
              },
              Channel: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          receivedMessages: {
            select: {
              id: true,
              sender: { select: { username: true } },
              body: true,
              Chat: {
                select: {
                  id: true,
                  users: { select: { username: true } },
                },
              },
              Channel: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          ChannelsOwner: { select: { id: true, name: true, type: true } },
          ChannelsAdmin: { select: { id: true, name: true, type: true } },
          ChannelsMember: { select: { id: true, name: true, type: true } },
        },
      });
      delete user?.password;
      req['user'] = user || null;
    } catch {
      throw new UnauthorizedException('Invalid Token');
    }
    return true;
  }
}
