import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { PlayerService } from './Player.service';

@Module({
  providers: [GameService, GameGateway, PlayerService],
})
export class GameModule {}
