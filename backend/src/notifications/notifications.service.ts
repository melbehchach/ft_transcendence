import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';
import { notificationDto } from 'src/dto/notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private gateway: NotificationsGateway,
  ) {}

  async createNotification(senderId: string, data: notificationDto) {
    try {
      const receiver = await this.prisma.user.findUnique({
        where: { id: data.receiverId },
      });
      if (!receiver) {
        throw new Error('Receiver Not Found');
      }
      const notification = await this.prisma.notification.create({
        data: {
          sender: {
            connect: {
              id: senderId,
            },
          },
          receiver: {
            connect: {
              id: receiver.id,
            },
          },
          type: data.type,
          message: data.message,
        },
      });
      if (!notification) {
        throw new Error('Failed to create record');
      }
      this.gateway.handleNotificationEvent(
        data.type,
        data.receiverId,
        notification,
      );
      return notification;
    } catch (error) {
      throw new BadRequestException({ error: error.message });
    }
  }

  async getNotification(notificationId: string, userId: string) {
    try {
      const notification = await this.prisma.notification.findFirst({
        where: {
          id: notificationId,
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });
      console.log(notification);
      if (!notification) {
        throw new Error('Failed to retrieve record');
      }
      if (notification.receiverId !== userId) {
        throw new Error('User not allowed to access this record');
      }
      return notification;
    } catch (error) {
      throw new BadRequestException({ error: error.message });
    }
  }

  async getNotifications(userId: string) {
    try {
      const notifications = await this.prisma.notification.findMany({
        where: {
          receiverId: userId,
        },
      });
      if (!notifications) {
        throw new Error('Failed to get notifications record');
      }
      return { notifications };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async markDelivered(notificationId: string) {
    try {
      const notification = await this.prisma.notification.update({
        where: {
          id: notificationId,
        },
        data: {
          delivered: true,
        },
      });
      if (!notification) {
        throw new Error('Failed to update notification record');
      }
      return { msg: 'success' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async markRead(notificationId: string) {
    try {
      const notification = await this.prisma.notification.update({
        where: {
          id: notificationId,
        },
        data: {
          read: true,
        },
      });
      if (!notification) {
        throw new Error('Failed to update notification record');
      }
      return { msg: 'success' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
