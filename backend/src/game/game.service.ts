import { NotificationsGateway } from "src/notifications/notifications.gateway";
import { NotificationsService } from "src/notifications/notifications.service";
import { PrismaService } from "src/prisma/prisma.service";
import { Inject, Injectable } from "@nestjs/common";
import { GameType } from "@prisma/client";
import { Server, Socket } from 'socket.io';

@Injectable()
export class GameService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async sendGameRequest(senderId: string, receiverId: string) {
    try {
      const sender = await this.prisma.user.findUnique({
        where: { id: senderId },
      });
      const receiver = await this.prisma.user.findUnique({
        where: { id: receiverId },
      });

      if (!sender || !receiver) {
        throw new Error('Sender or receiver not found');
      }

      if (sender.id === receiver.id) {
        throw new Error('Sender and receiver cannot be the same');
      }

      this.notificationsService.createNotification(senderId, receiverId);
      this.notificationsGateway.handleNotificationEvent(senderId, receiverId);
    } catch (error) {
      console.log(error);
    }
  }

  async acceptGameRequest(senderId: string, receiverId: string) {
    try {
      const game = await this.prisma.game.create({
        data: {
          Player: {
            connect: { id: senderId },
          },
          Opponent: {
            connect: { id: receiverId },
          },
          type: GameType.FriendMatch,
        },
      });
      this.notificationsGateway.handleAcceptEvent(senderId, receiverId, game.id);
	  return game;
    }
    catch (error) {
      console.log(error);
    }
  }

  async declineGameRequest(senderId: string, receiverId: string) {
    try {
      this.notificationsGateway.handleDeclineEvent(senderId, receiverId);
    } catch (error) {
      console.log(error);
    }
  }

  // async Achievements(userId: string) {
  //   try {
  //     const Achievements = await this.prisma.acheivement.findUnique({
  //       where: {
  //         id: userId,
  //       },
  //     });
  //     Achievements.
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async getMatchHistory(userId: string) {
    try {
      const MatchHistory = await this.prisma.game.findMany({
        where: {
          OR: [
            {
              Player: {
                id: userId,
              },
            },
            {
              Opponent: {
                id: userId,
              },
            },
          ],
        },
        orderBy: {  createdAt: 'desc' },
        include: {
          Player: true,
          Opponent: true,
        },
      });
      return MatchHistory;
    } catch (error) {
      console.log(error);
    }
  }

}