import { Module } from '@nestjs/common';
import { ChannelsService } from './channels/channels.service';
import { ChannelsController } from './channels/channels.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ChannelsGateway } from './channels/channels.gateway';
import { MessageService } from './message/message.service';
import { MessageController } from './message/message.controller';

@Module({
  imports: [AuthModule],
  controllers: [ChannelsController, MessageController],
  providers: [ChannelsGateway, ChannelsService, MessageService],
})
export class ChatModule {}
