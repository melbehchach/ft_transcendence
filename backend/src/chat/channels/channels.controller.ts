import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { newChannelDto, updateChannelDto } from 'src/dto/channels.dto';
import { ChatGuard } from 'src/guards/chat.jwt.guard';

@UseGuards(ChatGuard)
@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get('all')
  async getUserChannels(@Req() req) {
    if (!req.userID) {
      throw new InternalServerErrorException('Bad BadRequest');
    }
    const channels = await this.channelsService.getUserChannels(req.userID);
    return channels;
  }

  @Get(':id')
  async getChannelById(@Req() req, @Param('id') channelId: string) {
    if (!req.userID) {
      throw new InternalServerErrorException('Bad BadRequest');
    }
    const channel = await this.channelsService.getChannelById(
      channelId,
      req.userID,
    );
    return channel;
  }

  @Post('new')
  async createChannel(@Req() req, @Body() data: newChannelDto) {
    if (!req.userID) {
      throw new InternalServerErrorException('Bad BadRequest');
    }
    return this.channelsService.createChannel(data, req.userID);
  }

  @Patch(':id')
  async updateChannel(
    @Param('id') channelId: string,
    @Body() data: updateChannelDto,
    @Req() req,
  ) {
    if (!req.userID) {
      throw new InternalServerErrorException('Bad BadRequest');
    }
    return this.channelsService.updateChannel(req.userID, channelId, data);
  }

  @Delete(':id')
  async deleteChannel(@Param('id') channelId: string, @Req() req) {
    if (!req.userID) {
      throw new InternalServerErrorException('Bad BadRequest');
    }
    const result = this.channelsService.deleteChannel(channelId, req.userID);
    return result;
  }
}
