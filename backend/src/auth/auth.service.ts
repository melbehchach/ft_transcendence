import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { authDTO, signinDTO, signupDTO } from '../dto';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: authDTO) {
    const hash = await argon.hash(dto.password);
    try {
      await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          password: hash,
          avatar: dto.avatar,
          isAuthenticated: false,
          socketId: '',
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'An account with email or username already exists',
          );
        }
      }
    }
  }

  async signin(dto: signinDTO): Promise<{ id: string; accessToken: string }> {
    const user = await await this.prisma.user.findFirst({
      where: {
        username: dto.username,
      },
    });
    if (!user) throw new ForbiddenException('username or password incorrect');
    if (!user.isAuthenticated)
      throw new ForbiddenException('Unauthenticated User');
    const pwMatch = await argon.verify(user.password, dto.password);
    if (!pwMatch)
      throw new ForbiddenException('username or password incorrect');
    return this.signToken(user.id, user.email);
  }

  async finish_signup(
    dto: signupDTO,
    UserToken: string,
  ): Promise<{ id: string; accessToken: string }> {
    if (!UserToken) throw new UnauthorizedException('Invalid Request');
    try {
      await this.jwtService.verifyAsync(UserToken, {
        secret: this.config.get('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException();
    }
    const user = await this.findUser(dto.email);
    if (!user)
      throw new ForbiddenException('you need to signup with intra first');
    if (user.isAuthenticated)
      throw new ForbiddenException('User Already Authenticated ');
    if (dto.password !== dto.passwordConf)
      throw new ForbiddenException("passwords don't match");
    const hash = await argon.hash(dto.password);
    await this.prisma.user.update({
      where: {
        email: dto.email,
      },
      data: {
        username: dto.username,
        password: hash,
        isAuthenticated: true,
      },
    });
    return await this.signToken(user.id, user.email);
  }

  async saveAvatar(userToken: string, file: Express.Multer.File) {
    try {
      const payload = await this.jwtService.verifyAsync(userToken, {
        secret: this.config.get('JWT_SECRET'),
      });
      await this.prisma.user.updateMany({
        where: {
          email: payload.email,
        },
        data: {
          avatar: file.path,
        },
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  async signToken(
    userID: string,
    email: string,
  ): Promise<{ id: string; accessToken: string }> {
    const payload = { sub: userID, email };
    return {
      id: userID,
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async findUser(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        ChannelsOwner: true,
        ChannelsAdmin: true,
        ChannelsMember: true,
        chats: true,
      },
    });
    delete user?.password;
    return user;
  }
}
