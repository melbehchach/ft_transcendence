import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../guards/auth.jwt.guard';
import { FTStrategy } from './42.strategy';
import { FTAuthGuard } from '../guards/auth.42.guard';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { userGateway } from 'src/user/user.gateway';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
    PassportModule.register({ session: false }),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGuard,
    FTAuthGuard,
    FTStrategy,
    UserService,
    userGateway,
    NotificationsService,
    NotificationsGateway,
  ],
  exports: [AuthService],
})
export class AuthModule {}
