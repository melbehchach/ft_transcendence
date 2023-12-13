import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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
      return { msg: 'Success' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async cancelFriendRequest(friendRequest, userId) {
    try {
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
      return { msg: 'Success' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async declineFriendRequest(friendRequest, userId) {
    try {
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
      return { msg: 'Success' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async acceptFriendRequest(friendRequest, userId) {
    try {
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
