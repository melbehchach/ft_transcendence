import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { authDTO, signinDTO, signupDTO } from '../dto';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as speakeasy from 'speakeasy';
// import { userStatus } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private userService: UserService,
  ) {}

  async signup(dto: authDTO) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          password: hash,
          avatar: dto.avatar,
          isAuthenticated: false,
        },
      });
      return user;
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

  async redirect(req: any, res: any) {
    if (req.user.isAuthenticated) {
      const { id, accessToken } = await this.signToken(
        req.user.id,
        // req.user.email,
      );
      res.cookie('JWT_TOKEN', accessToken);
      res.cookie('USER_ID', id);
      if (req.user.TFAenabled) {
        res.redirect('http://localhost:3001/auth/TFA');
      } else {
        res.redirect('http://localhost:3001/profile');
      }
    } else {
      const userToken = await this.jwtService.signAsync({
        sub: req.user.email,
      });
      res.cookie('USER', userToken);
      res.redirect('http://localhost:3001/auth/42-redirect');
    }
  }

  async preAuth(req: any) {
    const token = req.cookies['USER'];
    if (!token) throw new UnauthorizedException('Invalid Request');
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get('JWT_SECRET'),
      });
      const user = await this.prisma.user.findUnique({
        where: {
          email: payload.sub,
        },
      });
      return { user };
    } catch {
      throw new UnauthorizedException('Invalid Token');
    }
  }

  async signin(dto: signinDTO, res: any) {
    try {
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
      const { id, accessToken } = await this.signToken(user.id);
      res.cookie('JWT_TOKEN', accessToken);
      res.cookie('USER_ID', id);
      // if (!user.TFAenabled) {
      //   await this.userService.updateUserStatus(user.id, userStatus.ONLINE);
      // }
      return user.TFAenabled;
    } catch (error) {
      throw new InternalServerErrorException({ error: error.message });
    }
  }

  async finish_signup(
    dto: signupDTO,
    UserToken: string,
  ): Promise<{ id: string; accessToken: string }> {
    if (!UserToken) throw new UnauthorizedException('Invalid Request');
    try {
      const payload = await this.jwtService.verifyAsync(UserToken, {
        secret: this.config.get('JWT_SECRET'),
      });
      const user = await this.prisma.user.findUnique({
        where: {
          email: payload.sub,
        },
      });
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
      return await this.signToken(user.id);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException({
          error: `username ${dto.username} is already taken`,
        });
      } else {
        throw new UnauthorizedException({ error: error.message });
      }
    }
  }

  async saveAvatar(userToken: string, file: Express.Multer.File) {
    try {
      const payload = await this.jwtService.verifyAsync(userToken, {
        secret: this.config.get('JWT_SECRET'),
      });
      await this.prisma.user.update({
        where: {
          email: payload.sub,
        },
        data: {
          avatar: `http://localhost:3000/${file.filename}`,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException({
        error: 'Failed to upload avatar',
      });
    }
  }

  async signToken(
    userID: string,
    // email: string,
  ): Promise<{ id: string; accessToken: string }> {
    const payload = { sub: userID };
    return {
      id: userID,
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async findUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        // email: email,
        id,
      },
    });
    delete user?.password;
    return user;
  }

  async TFAgetSecret(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { TFAenabled: true },
      });
      if (!user.TFAenabled) {
        const secretObject = speakeasy.generateSecret();
        const TFAtempSecret = secretObject.base32;
        const userUpdate = await this.prisma.user.update({
          where: {
            id,
          },
          data: {
            TFAtempSecret,
          },
        });
        if (!userUpdate) {
          throw new Error('Failed to update record');
        }
        return { secret: userUpdate.TFAtempSecret };
      } else {
        return {};
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async TFAenable(id: string, token: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { TFAtempSecret: true, TFAenabled: true },
      });
      if (!user.TFAenabled) {
        const isValid = speakeasy.totp.verify({
          secret: user.TFAtempSecret,
          encoding: 'base32',
          token: token,
        });
        if (isValid) {
          const userUpdate = await this.prisma.user.update({
            where: {
              id,
            },
            data: {
              TFAtempSecret: null,
              TFAenabled: true,
              TFAsecret: user.TFAtempSecret,
            },
          });
          if (!userUpdate) {
            throw new Error('Failed to update record');
          }
          return { enabled: true };
        } else {
          return { enabled: false };
        }
      } else {
        return {};
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async TFAverifyCode(id: string, token: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { id: true, TFAsecret: true, TFAenabled: true },
      });
      if (user.TFAenabled) {
        const isValid = speakeasy.totp.verify({
          secret: user.TFAsecret,
          encoding: 'base32',
          token: token,
        });
        // if (isValid) {
        //   await this.userService.updateUserStatus(user.id, userStatus.ONLINE);
        // }
        return isValid;
      } else {
        return {};
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async TFAdisable(id: string) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          TFAenabled: false,
          TFAsecret: null,
        },
      });
      if (!user) {
        throw new Error('Failed to update record');
      }
      return { success: true };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
