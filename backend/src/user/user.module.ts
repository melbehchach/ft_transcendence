import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserGuard } from 'src/guards/user.jwt.guard';
// import { AuthService } from 'src/auth/auth.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { userGateway } from './user.gateway';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    userGateway,
    UserGuard,
    // AuthService,
    NotificationsService,
    NotificationsGateway,
  ],
  exports: [userGateway, UserService],
})
export class UserModule {}
