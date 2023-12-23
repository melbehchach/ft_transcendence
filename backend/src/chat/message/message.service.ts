import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChannelMessageDto } from 'src/dto/message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelsGateway } from '../channels/channels.gateway';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly channelsGateway: ChannelsGateway,
  ) {}

  async newChannelMessage(data: ChannelMessageDto, userId: string) {
    try {
      if (data.senderId !== userId) {
        throw new Error('Forbidden');
      }
      const channel = await this.prisma.channel.findUnique({
        where: { id: data.channelId },
        include: { Members: true },
      });
      if (!channel) {
        throw new Error('Channel not found');
      }
      if (channel.Members.map((member) => member.id).indexOf(userId) === -1) {
        throw new Error('User not member');
      }
      const message = await this.prisma.message.create({
        data: {
          body: data.body,
          sender: {
            connect: {
              id: userId,
            },
          },
          Channel: {
            connect: {
              id: data.channelId,
            },
          },
        },
      });
      if (!message) {
        throw new Error('Failed to save record');
      }
      this.channelsGateway.sendMessage(data);
      return message;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getMessageById(id: number) {
    try {
      const message = await this.prisma.message.findUnique({
        where: { id },
      });
      return message ?? null;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error occured while retreiving record',
      );
    }
  }
}
