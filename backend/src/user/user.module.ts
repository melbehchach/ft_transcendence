import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserGuard } from 'src/guards/user.jwt.guard';
// import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Module({
  // imports: [
  // JwtModule.register({
  // global: true,
  // secret: process.env.JWT_SECRET,
  // }),
  // ],
  controllers: [UserController],
  providers: [
    UserService,
    UserGuard,
    AuthService,
    NotificationsService,
    NotificationsGateway,
  ],
})
export class UserModule {}
