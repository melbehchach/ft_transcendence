import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async sendFriendRequest(body, userId) {
    const receiver = await this.prisma.user.findUnique({
      where: { id: body.receiverId },
      select: {
        friends: { where: { id: body.senderId } },
      },
    });
    const sender = await this.prisma.user.findUnique({
      where: { id: body.senderId },
    });
    if (
      !sender ||
      !receiver ||
      body.senderId !== userId ||
      body.senderId === body.receiverId ||
      receiver.friends.length !== 0
    )
      return { msg: 'Internal Server Error: cannotSendRequest' };
    const request =
      (await this.prisma.friendRequest.findFirst({
        where: {
          senderId: body.senderId,
          receiverId: body.receiverId,
          status: Status.PENDING,
        },
      })) ||
      (await this.prisma.friendRequest.findFirst({
        where: {
          senderId: body.receiverId,
          receiverId: body.sender,
          status: Status.PENDING,
        },
      }));
    if (request) {
      return { msg: 'Internal Server Error: cannotSendRequest' };
    }
    const newRequest = await this.prisma.friendRequest.create({
      data: {
        sender: {
          connect: {
            id: body.senderId,
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
    return {
      msg: newRequest ? 'Success' : 'Internal Server Error',
    };
  }

  async cancelFriendRequest(friendRequest, userId) {
    if (
      friendRequest.senderId !== userId ||
      friendRequest.status !== Status.PENDING
    )
      return {
        msg: 'Internal Server Error: CannotCancelRequest',
      };
    const request = await this.prisma.friendRequest.update({
      where: {
        id: friendRequest.id,
      },
      data: {
        status: Status.CANCELED,
      },
    });
    return {
      msg: request ? 'Success' : 'Internal Server Error: requestNotFound',
    };
  }

  async declineFriendRequest(friendRequest, userId) {
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
    return {
      msg: request ? 'Success' : 'Internal Server Error: requestNotFound',
    };
  }

  async acceptFriendRequest(friendRequest, userId) {
    if (
      friendRequest.receiverId !== userId ||
      friendRequest.status !== Status.PENDING
    )
      return {
        msg: 'Internal Server Error: CannotAcceptRequest',
      };
    try {
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
    } catch (e) {
      console.log(e);
      return {
        msg: 'Internal Server Error: databseUpdateFailed',
      };
    }
    const request = await this.prisma.friendRequest.update({
      where: {
        id: friendRequest.id,
      },
      data: {
        status: Status.ACCEPTED,
      },
    });
    return {
      msg: request ? 'Success' : 'Internal Server Error: requestNotFound',
    };
  }

  async unfriendUser(friendId, userId) {
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
    if (!user.friends.length)
      return { msg: 'Internal Server Error: CannotUnfriendUser' };
    try {
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
    } catch {
      return { msg: 'Internal Server Error: CannotUnfriendUser' };
    }
    return { msg: 'Success' };
  }
}
