import { Module } from '@nestjs/common';
import { ChannelsService } from './channels/channels.service';
import { ChannelsController } from './channels/channels.controller';
import { ChannelsModule } from './channels/channels.module';

@Module({
  imports: [ChannelsModule],
  controllers: [ChannelsController],
  providers: [ChannelsService],
})
export class ChatModule {}
