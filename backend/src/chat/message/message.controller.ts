import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { ChannelMessageDto } from 'src/dto/message.dto';
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

  @Get(':id')
  async getMesssageById(@Param('id') messageId: string) {
    return this.messageService.getMessageById(parseInt(messageId));
  }

  // only for debugging
  @Delete('all')
  async clearMessages() {
    return await this.prisma.message.deleteMany();
  }
}
