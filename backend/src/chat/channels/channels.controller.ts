import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  // Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { editTypeDto, makeAdminDto, newChannelDto } from 'src/dto/channels.dto';
// import { updateChannelDto } from 'src/dto/channels.dto';
import { ChatGuard } from 'src/guards/chat.jwt.guard';
import { PrismaService } from 'src/prisma/prisma.service';

@UseGuards(ChatGuard)
@Controller('channels')
export class ChannelsController {
  constructor(
    private readonly channelsService: ChannelsService,
    private prisma: PrismaService,
  ) {}

  @Get('all')
  async getUserChannels(@Req() req) {
    if (!req.userID) {
      throw new InternalServerErrorException('BadRequest');
    }
    const channels = await this.channelsService.getUserChannels(req.userID);
    return channels;
  }

  @Get(':id')
  async getChannelById(@Req() req, @Param('id') channelId: string) {
    if (!channelId || !req.userID) {
      throw new InternalServerErrorException('BadRequest');
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
      throw new InternalServerErrorException('BadRequest');
    }
    return this.channelsService.createChannel(data, req.userID);
  }

  // @Put(':id')
  // async updateChannel(
  //   @Param('id') channelId: string,
  //   @Body() data: updateChannelDto,
  //   @Req() req,
  // ) {
  //   if (!req.userID) {
  //     throw new InternalServerErrorException('BadRequest');
  //   }
  //   return this.channelsService.updateChannel(req.userID, channelId, data);
  // }

  @Patch(':id/editName')
  async editChannelName(@Param('id') channelId: string, @Req() req) {
    if (!channelId || !req.userID) {
      throw new InternalServerErrorException('BadRequest');
    }
    return this.channelsService.editChannelName(
      req.userID,
      channelId,
      req.body,
    );
  }

  @Patch(':id/editAvatar')
  async editChannelAvatar(@Param('id') channelId: string, @Req() req) {
    if (!channelId || !req.userID) {
      throw new InternalServerErrorException('BadRequest');
    }
    return this.channelsService.editChannelAvatar(
      req.userID,
      channelId,
      req.body,
    );
  }

  @Patch(':id/editType')
  async editChannelType(
    @Param('id') channelId: string,
    @Req() req,
    @Body() body: editTypeDto,
  ) {
    if (!channelId || !req.userID) {
      throw new InternalServerErrorException('BadRequest');
    }
    return this.channelsService.editChannelType(req.userID, channelId, body);
  }

  @Patch(':id/editMembers')
  async editChannelMembers(@Param('id') channelId: string, @Req() req) {
    if (!channelId || !req.userID) {
      throw new InternalServerErrorException('BadRequest');
    }
    return this.channelsService.editChannelMembers(
      req.userID,
      channelId,
      req.body,
    );
  }

  @Patch(':id/kick')
  async kickUser(@Param('id') channelId: string, @Req() req, @Body() body) {
    if (!req.userID || !channelId || !body.id) {
      throw new InternalServerErrorException('BadRequest');
    }
    return this.channelsService.kickUser(req.userID, channelId, body);
  }

  @Patch(':id/ban')
  async banUser(@Param('id') channelId: string, @Req() req, @Body() body) {
    if (!req.userID || !channelId || !body.id) {
      throw new InternalServerErrorException('BadRequest');
    }
    return this.channelsService.banUser(req.userID, channelId, body);
  }

  @Patch(':id/unban')
  async unbanUser(@Param('id') channelId: string, @Req() req, @Body() body) {
    if (!req.userID || !channelId || !body.id) {
      throw new InternalServerErrorException('BadRequest');
    }
    return this.channelsService.unbanUser(req.userID, channelId, body);
  }

  @Patch(':id/makeAdmin')
  async makeAdmin(
    @Param('id') channelId: string,
    @Req() req,
    @Body() body: makeAdminDto,
  ) {
    if (!req.userID || !channelId) {
      throw new InternalServerErrorException('BadRequest');
    }
    return this.channelsService.makeAdmin(req.userID, channelId, body);
  }

  @Delete(':id')
  async deleteChannel(@Param('id') channelId: string, @Req() req) {
    if (!channelId || !req.userID) {
      throw new InternalServerErrorException('BadRequest');
    }
    return this.channelsService.deleteChannel(channelId, req.userID);
  }

  // only for debugging
  @Delete('delete/all')
  async clearChannels() {
    return await this.prisma.channel.deleteMany();
  }
}
