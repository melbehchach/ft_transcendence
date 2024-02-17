import {
  Body,
  Controller,
  Delete,
  Get,
  BadRequestException,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { editTypeDto, makeAdminDto, newChannelDto } from 'src/dto/channels.dto';
import { ChatGuard } from 'src/guards/chat.jwt.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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
      throw new BadRequestException();
    }
    const channels = await this.channelsService.getUserChannels(req.userID);
    return channels;
  }

  @Get('explore')
  async exploreChannels(@Req() req) {
    if (!req.userID) {
      throw new BadRequestException();
    }
    return this.channelsService.exploreChannels(req.userID);
  }

  @Get(':id')
  async getChannelById(@Req() req, @Param('id') channelId: string) {
    if (!channelId || !req.userID) {
      throw new BadRequestException();
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
      throw new BadRequestException();
    }
    return this.channelsService.createChannel(data, req.userID);
  }

  @Post(':id/join')
  async joinChannel(@Param('id') channelId: string, @Req() req) {
    if (!channelId || !req.userID) {
      throw new BadRequestException();
    }
    return this.channelsService.joinChannel(channelId, req.body, req.userID);
  }

  @Post(':id/leave')
  async leaveChannel(@Param('id') channelId: string, @Req() req) {
    if (!channelId || !req.userID) {
      throw new BadRequestException();
    }
    return this.channelsService.leaveChannel(channelId, req.userID);
  }

  @Patch(':id/editName')
  async editChannelName(@Param('id') channelId: string, @Req() req) {
    if (!channelId || !req.userID) {
      throw new BadRequestException();
    }
    return this.channelsService.editChannelName(
      req.userID,
      channelId,
      req.body,
    );
  }

  @Patch(':id/editAvatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}_${file.originalname}`);
        },
      }),
    }),
  )
  async editChannelAvatar(
    @Param('id') channelId: string,
    @Req() req,
    @UploadedFile() file,
  ) {
    if (!channelId || !req.userID) {
      throw new BadRequestException();
    }
    return this.channelsService.editChannelAvatar(req.userID, channelId, file);
  }

  @Patch(':id/editType')
  async editChannelType(
    @Param('id') channelId: string,
    @Req() req,
    @Body() body: editTypeDto,
  ) {
    if (!channelId || !req.userID) {
      throw new BadRequestException();
    }
    return this.channelsService.editChannelType(req.userID, channelId, body);
  }

  @Patch(':id/addMembers')
  async editChannelMembers(@Param('id') channelId: string, @Req() req) {
    if (!channelId || !req.userID) {
      throw new BadRequestException();
    }
    return this.channelsService.addMembers(req.userID, channelId, req.body);
  }

  @Patch(':id/kickMembers')
  async kickMembers(@Param('id') channelId: string, @Req() req, @Body() body) {
    if (!req.userID || !channelId) {
      throw new BadRequestException();
    }
    return this.channelsService.kickMembers(req.userID, channelId, body);
  }

  @Patch(':id/ban')
  async banUser(@Param('id') channelId: string, @Req() req, @Body() body) {
    if (!req.userID || !channelId || !body.id) {
      throw new BadRequestException();
    }
    return this.channelsService.banUser(req.userID, channelId, body);
  }

  @Patch(':id/unban')
  async unbanUser(@Param('id') channelId: string, @Req() req, @Body() body) {
    if (!req.userID || !channelId || !body.id) {
      throw new BadRequestException();
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
      throw new BadRequestException();
    }
    return this.channelsService.makeAdmin(req.userID, channelId, body);
  }

  @Delete(':id')
  async deleteChannel(@Param('id') channelId: string, @Req() req) {
    if (!channelId || !req.userID) {
      throw new BadRequestException();
    }
    return this.channelsService.deleteChannel(channelId, req.userID);
  }

  // only for debugging
  @Delete('delete/all')
  async clearChannels() {
    return await this.prisma.channel.deleteMany();
  }
}
