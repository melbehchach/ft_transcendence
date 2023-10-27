import { Module } from '@nestjs/common';
import { ChannelsService } from './channels/channels.service';
import { ChannelsController } from './channels/channels.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ChannelsGateway } from './channels/channels.gateway';
import { MessageModule } from './message/message.module';

@Module({
  imports: [AuthModule, MessageModule],
  controllers: [ChannelsController],
  providers: [ChannelsService, ChannelsGateway],
})
export class ChatModule {}
