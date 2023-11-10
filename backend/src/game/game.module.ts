import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { PlayerService } from './Player.service';
// import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [GameService, GameGateway, PlayerService],
  controllers: [],
})
export class GameModule {}
