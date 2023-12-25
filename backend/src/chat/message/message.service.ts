import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChannelMessageDto, DirectMessageDto } from 'src/dto/message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelsGateway } from '../channels/channels.gateway';
import { DirectMessagesGateway } from '../direct-messages/direct-messages.gateway';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly channelsGateway: ChannelsGateway,
    private readonly DMsGateway: DirectMessagesGateway,
  ) {}

  async newChannelMessage(data: ChannelMessageDto, userId: string) {
    try {
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
      this.channelsGateway.sendMessage({ ...data, senderId: userId });
      return message;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async newDirectMessage(data: DirectMessageDto, userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: data.receiverId },
        include: {
          friends: true,
        },
      });
      if (!user) {
        throw new Error('User Not Found');
      }
      if (data.receiverId === userId) {
        throw new Error('Invalid operation: sender and receiver are the same');
      }
      if (user.friends.map((friend) => friend.id).indexOf(userId) === -1) {
        throw new Error(
          'Invalid operation: sender and receiver are not friends',
        );
      }
      const message = await this.prisma.message.create({
        data: {
          body: data.body,
          sender: {
            connect: {
              id: userId,
            },
          },
          receiver: {
            connect: {
              id: data.receiverId,
            },
          },
        },
      });
      if (!message) {
        throw new Error('Failed to create record');
      }
      this.DMsGateway.sendMessage({ ...data, senderId: userId });
      return message;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async messageDelivered(id: number) {
    console.log(id);
    try {
      const message = await this.prisma.message.update({
        where: { id },
        data: {
          delivered: true,
        },
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
