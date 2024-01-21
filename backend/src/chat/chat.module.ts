import { Module } from '@nestjs/common';
import { ChannelsService } from './channels/channels.service';
import { ChannelsController } from './channels/channels.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ChannelsGateway } from './channels/channels.gateway';
import { MessageService } from './message/message.service';
import { MessageController } from './message/message.controller';
import { directMessagesController } from './direct-messages/direct-messages.controller';
import { DirectMessagesGateway } from './direct-messages/direct-messages.gateway';
import { DirectMessagesService } from './direct-messages/direct-messages.service';

@Module({
  imports: [AuthModule],
  controllers: [
    directMessagesController,
    ChannelsController,
    MessageController,
  ],
  providers: [
    DirectMessagesGateway,
    DirectMessagesService,
    ChannelsGateway,
    ChannelsService,
    MessageService,
  ],
})
export class ChatModule {}
