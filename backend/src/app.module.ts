import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user/user.module';
import { GameService } from './game/game.service';
import { GameGateway } from './game/game.gateway';
import { GameController } from './game/game.controller';
import { GameModule } from './game/game.module';
import { PlayerService } from './game/Player.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    PassportModule,
    UserModule,
    GameModule,
  ],
  providers: [GameService, GameGateway, PlayerService],
  controllers: [GameController],
})
export class AppModule {}
