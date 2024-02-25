import { Injectable, BadRequestException } from '@nestjs/common';
import { ChannelMessageDto, DirectMessageDto } from 'src/dto/message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelsGateway } from '../channels/channels.gateway';
import { DirectMessagesGateway } from '../direct-messages/direct-messages.gateway';
import { DirectMessagesService } from '../direct-messages/direct-messages.service';
import { NotificationType } from '@prisma/client';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly channelsGateway: ChannelsGateway,
    private readonly DMsGateway: DirectMessagesGateway,
    private readonly DMsService: DirectMessagesService,
    private readonly notifications: NotificationsService,
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
      channel.Members.forEach((member) => {
        this.notifications.createNotification(userId, {
          receiverId: member.id,
          type: NotificationType.Message,
          message: `New message from ${channel.name}`,
        });
      });
      return message;
    } catch (error) {
      // console.log(error);
      throw new BadRequestException(error);
    }
  }

  async newDirectMessage(data: DirectMessageDto, userId: string) {
    try {
      const chat = await this.DMsService.newChat(data.receiverId, userId);
      if (chat.isBlocked) {
        throw new Error('This chat is blocked. You cannot send messages');
      }
      const sender = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      const receiver = await this.prisma.user.findUnique({
        where: { id: data.receiverId },
        include: {
          friends: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });
      if (!receiver) {
        throw new Error('User Not Found');
      }
      if (data.receiverId === userId) {
        throw new Error('Invalid operation: sender and receiver are the same');
      }
      if (receiver.friends.map((friend) => friend.id).indexOf(userId) === -1) {
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
          Chat: {
            connect: {
              id: chat.id,
            },
          },
        },
      });
      if (!message) {
        throw new Error('Failed to create record');
      }
      this.DMsGateway.sendMessage({ ...data, senderId: userId });
      this.notifications.createNotification(userId, {
        receiverId: receiver.id,
        type: NotificationType.Message,
        message: `New message from ${sender.username}`,
      });
      return message;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async messageDelivered(id: number) {
    // console.log(id);
    try {
      const message = await this.prisma.message.update({
        where: { id },
        data: {
          delivered: true,
        },
      });
      return message ?? null;
    } catch (error) {
      // console.log(error);
      throw new BadRequestException('Error occured while retreiving record');
    }
  }
}
