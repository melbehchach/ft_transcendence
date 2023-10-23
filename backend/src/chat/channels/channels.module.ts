import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsGateway } from './channels.gateway';
import { ChannelsController } from './channels.controller';

@Module({
  controllers: [ChannelsController],
  providers: [ChannelsService, ChannelsGateway],
  exports: [ChannelsService],
})
export class ChannelsModule {}
