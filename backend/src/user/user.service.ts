import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ChannelType,
  NotificationType,
  Status,
  GameTheme,
  userStatus,
} from '@prisma/client';
import { searchDto } from 'src/dto/search.dto';
import { SearchType } from 'src/dto/search.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import * as argon from 'argon2';
import { userGateway } from './user.gateway';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private notifications: NotificationsService,
    private gateway: userGateway,
  ) {}

  async search(params: searchDto) {
    console.log(params);
    const findUsers = async (query) => {
      return await this.prisma.user.findMany({
        where: {
          username: {
            mode: 'insensitive',
            startsWith: query,
          },
        },
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      });
    };
    const findChannels = async (query) => {
      return await this.prisma.channel.findMany({
        where: {
          name: {
            mode: 'insensitive',
            startsWith: query,
          },
          type: {
            in: [ChannelType.PUBLIC, ChannelType.PROTECTED],
          },
        },
        select: {
          id: true,
          name: true,
          image: true,
          type: true,
          Members: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });
    };
    try {
      if (params.type === SearchType.USERS) {
        console.log('users');
        const users = await findUsers(params.query);
        return users;
      } else if (params.type === SearchType.CHANNELS) {
        console.log('channels');
        const channels = await findChannels(params.query);
        return channels;
      } else {
        console.log('all');
        const users = await findUsers(params.query);
        const channels = await findChannels(params.query);
        return { users, channels };
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getProfile(id: string) {
    try {
      const user = this.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          username: true,
          avatar: true,
          friends: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          sentRequests: {},
          receivedRequests: {},
          receivedNotifications: true,
          gameTheme: true,
          status: true,
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUserStatus(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          status: true,
        },
      });
      if (!user) {
        throw new Error('Failed to get record');
      }
      return user.status;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateUserStatus(id: string, status: userStatus) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          status,
        },
        select: {
          id: true,
          status: true,
          friends: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!user) {
        throw new Error('Failed to update record');
      }
      const friends = user.friends.map((friend) => {
        return friend.id;
      });
      this.gateway.updateStatusEvent(user.id, user.status, friends);
      return 'success';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getFriendRequests(id: string) {
    try {
      const user = this.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          sentRequests: {},
          receivedRequests: {},
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getFriends(id: string) {
    try {
      const user = this.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          friends: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // verify with the auth method before pushing
  async editAvatar(id: string, avatar: Express.Multer.File) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          avatar: avatar.path,
        },
      });
      if (!user) {
        throw new Error('Failed to update record');
      }
      return { msg: 'success' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async editUsername(id: string, username: string) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          username,
        },
      });
      if (!user) {
        throw new Error('Failed to update record');
      }
      return { msg: 'success' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async editPassword(id: string, old_password: string, new_password: string) {
    try {
      if (!old_password || !new_password) {
        throw new Error('missing fields');
      }
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          password: true,
        },
      });
      const pwMatch = await argon.verify(user.password, old_password);
      if (!pwMatch) {
        throw new Error('password incorrect');
      }
      const hash = await argon.hash(new_password);
      const updatedUser = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          password: hash,
        },
      });
      if (!updatedUser) {
        throw new Error('Failed to update record');
      }
      return { msg: 'success' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async editTheme(id: string, theme: GameTheme) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          gameTheme: theme,
        },
      });
      if (!user) {
        throw new Error('Failed to update record');
      }
      return { msg: 'success' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUSerProfile(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          avatar: true,
          friends: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          status: true,
        },
      });
      if (!user) {
        throw new Error('User Not Found');
      }
      // console.log(user);
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async sendFriendRequest(body, userId) {
    try {
      const sender = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          username: true,
        },
      });
      const receiver = await this.prisma.user.findUnique({
        where: { id: body.receiverId },
        select: {
          friends: { where: { id: userId } },
        },
      });
      if (
        !receiver ||
        userId === body.receiverId ||
        receiver.friends.length !== 0
      ) {
        throw new Error('Internal Server Error: cannotSendRequest');
      }
      const request =
        (await this.prisma.friendRequest.findFirst({
          where: {
            senderId: userId,
            receiverId: body.receiverId,
            status: Status.PENDING,
          },
        })) ||
        (await this.prisma.friendRequest.findFirst({
          where: {
            senderId: body.receiverId,
            receiverId: userId,
            status: Status.PENDING,
          },
        }));
      if (request) {
        throw new Error('Internal Server Error: Request Already Exists');
      }
      const newRequest = await this.prisma.friendRequest.create({
        data: {
          sender: {
            connect: {
              id: userId,
            },
          },
          receiver: {
            connect: {
              id: body.receiverId,
            },
          },
          status: Status.PENDING,
        },
      });
      if (!newRequest) {
        throw new Error('Failed to create record');
      }
      this.notifications.createNotification(userId, {
        receiverId: body.receiverId,
        type: NotificationType.FriendRequest,
        message: `${sender.username} has sent you a friend request`,
      });
      return { msg: 'Success' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async cancelFriendRequest(friendRequest, userId) {
    try {
      const sender = await this.prisma.user.findUnique({
        where: { id: friendRequest.senderId },
        select: {
          username: true,
        },
      });
      if (
        friendRequest.senderId !== userId ||
        friendRequest.status !== Status.PENDING
      ) {
        throw new Error('Internal Server Error: CannotCancelRequest');
      }
      const request = await this.prisma.friendRequest.update({
        where: {
          id: friendRequest.id,
        },
        data: {
          status: Status.CANCELED,
        },
      });
      if (!request) {
        throw new Error('Internal Server Error: requestNotFound');
      }
      this.notifications.createNotification(userId, {
        receiverId: friendRequest.receiverId,
        type: NotificationType.FriendRequest,
        message: `${sender.username} cancelled the friend request`,
      });
      return { msg: 'Success' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async declineFriendRequest(friendRequest, userId) {
    try {
      const receiver = await this.prisma.user.findUnique({
        where: { id: friendRequest.receiverId },
        select: {
          username: true,
        },
      });
      if (
        friendRequest.receiverId !== userId ||
        friendRequest.status !== Status.PENDING
      )
        return {
          msg: 'Internal Server Error: CannotDeclineRequest',
        };
      const request = await this.prisma.friendRequest.update({
        where: {
          id: friendRequest.id,
        },
        data: {
          status: Status.DECLINED,
        },
      });
      if (!request) {
        throw new Error('Internal Server Error: requestNotFound');
      }
      this.notifications.createNotification(userId, {
        receiverId: friendRequest.senderId,
        type: NotificationType.FriendRequest,
        message: `${receiver.username} declined your friend request`,
      });
      return { msg: 'Success' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async acceptFriendRequest(friendRequest, userId) {
    try {
      const receiver = await this.prisma.user.findUnique({
        where: { id: friendRequest.receiverId },
        select: {
          username: true,
        },
      });
      if (
        friendRequest.receiverId !== userId ||
        friendRequest.status !== Status.PENDING
      ) {
        throw new Error('Internal Server Error: CannotAcceptRequest');
      }
      const addSender = this.prisma.user.update({
        where: {
          id: friendRequest.senderId,
        },
        data: {
          friends: { connect: [{ id: friendRequest.receiverId }] },
        },
      });
      const addReceiver = this.prisma.user.update({
        where: {
          id: friendRequest.receiverId,
        },
        data: {
          friends: { connect: [{ id: friendRequest.senderId }] },
        },
      });
      await this.prisma.$transaction([addSender, addReceiver]);
      const request = await this.prisma.friendRequest.update({
        where: {
          id: friendRequest.id,
        },
        data: {
          status: Status.ACCEPTED,
        },
      });
      if (!request) {
        throw new Error('Internal Server Error: requestNotFound');
      }
      this.notifications.createNotification(userId, {
        receiverId: friendRequest.senderId,
        type: NotificationType.FriendRequest,
        message: `${receiver.username} accepted your friend request`,
      });
      return { msg: 'Success' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async unfriendUser(friendId, userId) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          friends: {
            where: {
              id: friendId,
            },
          },
        },
      });
      if (!user.friends.length) {
        throw new Error('Internal Server Error: CannotUnfriendUser');
      }
      const removeUserA = this.prisma.user.update({
        where: { id: userId },
        data: {
          friends: {
            disconnect: {
              id: friendId,
            },
          },
        },
        include: {
          friends: { select: { username: true } },
        },
      });
      const removeUserB = this.prisma.user.update({
        where: { id: friendId },
        data: {
          friends: {
            disconnect: {
              id: userId,
            },
          },
        },
        include: {
          friends: { select: { username: true } },
        },
      });
      await this.prisma.$transaction([removeUserA, removeUserB]);
      return { msg: 'Success' };
    } catch {
      throw new InternalServerErrorException(
        'Internal Server Error: CannotUnfriendUser',
      );
    }
  }
}
