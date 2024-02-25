import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
        const users = await findUsers(params.query);
        return users;
      } else if (params.type === SearchType.CHANNELS) {
        const channels = await findChannels(params.query);
        return channels;
      } else {
        const users = await findUsers(params.query);
        const channels = await findChannels(params.query);
        return { users, channels };
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
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
          blockedUsers: {
            select: {
              id: true,
              username: true,
            },
          },
          blockedByUsers: {
            select: {
              id: true,
              username: true,
            },
          },
          receivedNotifications: true,
          gameTheme: true,
          status: true,
        },
      });
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
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
      throw new BadRequestException(error.message);
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
      throw new BadRequestException(error.message);
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
      throw new BadRequestException(error.message);
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
              status: true,
            },
          },
        },
      });
      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async editAvatar(id: string, avatar: Express.Multer.File) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          avatar: `http://localhost:3000/uploads/${avatar.filename}`,
        },
      });
      if (!user) {
        throw new Error('Failed to update record');
      }
      return { msg: 'success' };
    } catch (error) {
      throw new BadRequestException(error.message);
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
      if (error.code === 'P2002') {
        throw new BadRequestException({
          error: `username ${username} is already taken`,
        });
      } else {
        throw new UnauthorizedException({ error: error.message });
      }
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
      throw new BadRequestException(error.message);
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
      throw new BadRequestException(error.message);
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
      throw new BadRequestException(error.message);
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
      throw new BadRequestException(error.message);
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
      throw new BadRequestException(error.message);
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
      throw new BadRequestException(error.message);
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
      throw new BadRequestException(error.message);
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
      throw new BadRequestException(
        'Internal Server Error: CannotUnfriendUser',
      );
    }
  }

  async blockUser(friendId: string, userId: string) {
    try {
      const transactionPromises = [];
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          blockedUsers: {
            where: {
              id: friendId,
            },
          },
          blockedByUsers: {
            where: {
              id: friendId,
            },
          },
        },
      });
      if (user.blockedUsers.length !== 0 || user.blockedByUsers.length !== 0) {
        return { msg: 'Successd' };
      }
      const userToBlock = await this.prisma.user.findUnique({
        where: { id: friendId },
      });
      if (!userToBlock) {
        throw new Error('User Not Found');
      }
      const updatedUser = this.prisma.user.update({
        where: { id: user.id },
        data: {
          blockedUsers: {
            connect: {
              id: userToBlock.id,
            },
          },
          friends: {
            disconnect: {
              id: userToBlock.id,
            },
          },
        },
      });
      transactionPromises.push(updatedUser);
      const updatedUserToBlock = this.prisma.user.update({
        where: { id: userToBlock.id },
        data: {
          blockedByUsers: {
            connect: {
              id: user.id,
            },
          },
          friends: {
            disconnect: {
              id: user.id,
            },
          },
        },
      });
      transactionPromises.push(updatedUserToBlock);
      const chat =
        (await this.prisma.chat.findFirst({
          where: {
            user1Id: user.id,
            user2Id: userToBlock.id,
          },
        })) ||
        (await this.prisma.chat.findFirst({
          where: {
            user1Id: userToBlock.id,
            user2Id: user.id,
          },
        }));
      if (chat) {
        const blockChat = this.prisma.chat.update({
          where: { id: chat.id },
          data: { isBlocked: true },
        });
        transactionPromises.push(blockChat);
      }
      await this.prisma.$transaction(transactionPromises);
      this.notifications.createNotification(userId, {
        receiverId: userToBlock.id,
        type: NotificationType.Block,
        message: ``,
      });
      return { msg: 'Success' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async unblockUser(friendId: string, userId: string) {
    try {
      const transactionPromises = [];
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          blockedUsers: {
            where: {
              id: friendId,
            },
          },
        },
      });
      if (user.blockedUsers.length === 0) {
        return { msg: 'Success' };
      }
      const blockedUser = await this.prisma.user.findUnique({
        where: { id: friendId },
      });
      if (!blockedUser) {
        throw new Error('User Not Found');
      }
      const updatedUser = this.prisma.user.update({
        where: { id: user.id },
        data: {
          blockedUsers: {
            disconnect: {
              id: blockedUser.id,
            },
          },
        },
      });
      transactionPromises.push(updatedUser);
      const updatedBlockedUser = this.prisma.user.update({
        where: { id: blockedUser.id },
        data: {
          blockedByUsers: {
            disconnect: {
              id: user.id,
            },
          },
        },
      });
      transactionPromises.push(updatedBlockedUser);
      const chat =
        (await this.prisma.chat.findFirst({
          where: {
            user1Id: user.id,
            user2Id: blockedUser.id,
          },
        })) ||
        (await this.prisma.chat.findFirst({
          where: {
            user1Id: blockedUser.id,
            user2Id: user.id,
          },
        }));
      if (chat) {
        const blockChat = this.prisma.chat.update({
          where: { id: chat.id },
          data: { isBlocked: false },
        });
        transactionPromises.push(blockChat);
      }
      await this.prisma.$transaction(transactionPromises);
      this.notifications.createNotification(userId, {
        receiverId: blockedUser.id,
        type: NotificationType.unBlock,
        message: ``,
      });
      return { msg: 'Success' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
