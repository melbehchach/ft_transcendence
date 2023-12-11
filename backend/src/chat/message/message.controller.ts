import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { messageDto } from 'src/dto/message.dto';
import { ChatGuard } from 'src/guards/chat.jwt.guard';

@UseGuards(ChatGuard)
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // @Get(':id')
  // async getMesssageById(@Param() messageId: string) {
  //   return this.messageService.getMessageById(parseInt(messageId));
  // }

  @Post('new')
  async newMessage(@Req() req, @Body() body: messageDto) {
    if (!req.userID) {
      throw new InternalServerErrorException('BadRequest');
    }
    return this.messageService.newMessage(body, req.userID);
  }
}
