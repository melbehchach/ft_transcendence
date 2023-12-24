import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';
// import { NotificationsGateway } from 'src/notifications/notifications.gateway';
// import { NotificationsService } from 'src/notifications/notifications.service';


@Module({
  imports: [NotificationsModule],
  controllers: [GameController],
  providers: [GameService, GameGateway],
})
export class GameModule {}
