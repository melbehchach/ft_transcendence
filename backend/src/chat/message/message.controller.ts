import {
  Body,
  Controller,
  Delete,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { ChannelMessageDto, DirectMessageDto } from 'src/dto/message.dto';
import { ChatGuard } from 'src/guards/chat.jwt.guard';
import { PrismaService } from 'src/prisma/prisma.service';

@UseGuards(ChatGuard)
@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('/channel/new')
  async newChannelMessage(@Req() req, @Body() body: ChannelMessageDto) {
    if (!req.userID) {
      throw new InternalServerErrorException('BadRequest');
    }
    return this.messageService.newChannelMessage(body, req.userID);
  }

  @Post('/direct/new')
  async newDirectMessage(@Req() req, @Body() body: DirectMessageDto) {
    if (!req.userID) {
      throw new InternalServerErrorException('BadRequest');
    }
    return this.messageService.newDirectMessage(body, req.userID);
  }

  @Patch(':id/deliver')
  async messageDelivered(@Param('id') messageId: string) {
    const id = parseInt(messageId);
    if (isNaN(id)) {
      throw new InternalServerErrorException('BadRequest');
    }
    return this.messageService.messageDelivered(id);
  }

  // only for debugging
  @Delete('all')
  async clearMessages() {
    return await this.prisma.message.deleteMany();
  }
}
