import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user/user.module';
import { GameService } from './game/game.service';
import { GameController } from './game/game.controller';
import { GameModule } from './game/game.module';
import { NotificationsModule } from './notifications/notifications.module';
// import { NotificationsGateway } from './notifications/notifications.gateway';
// import { NotificationsService } from './notifications/notifications.service';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    PassportModule,
    UserModule,
    GameModule,
    NotificationsModule,
    ChatModule,
  ],
  providers: [GameService],
  controllers: [GameController],
})
export class AppModule {}
