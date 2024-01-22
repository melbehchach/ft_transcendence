import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { GameType, userStatus, NotificationType } from '@prisma/client';

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
        select: {
          username: true,
        },
      });

      const receiver = await this.prisma.user.findUnique({
        where: { id: receiverId },
        select: {
          status: true,
          friends: true,
        },
      });

      if (
        !sender ||
        !receiver ||
        receiver.friends.length === 0 ||
        receiver.status === userStatus.OFFLINE
      ) {
        throw new BadRequestException(
          'Internal Server Error: cannotSendGameRequest',
        );
      }
      this.notificationsGateway.handleNotificationEvent(
        NotificationType.GameRequest,
        receiverId,
        `${sender.username} wants to play a game with you.`,
      );
    } catch (error) {
      throw new BadRequestException('Invalid sender or receiver data.');
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
      this.notificationsGateway.handleAcceptEvent(
        senderId,
        receiverId,
        game.id,
      );
      return game;
    } catch (error) {
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

  async unlockAchievement(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          achivements: true,
          wins: true,
        },
      });
      const achievement = await this.prisma.acheivement.findUnique({
        where: { playerId: userId },
      });
      if (!user || !achievement) {
        throw new BadRequestException('Invalid user or achievement data.');
      }
      if (user.wins === 1) {
        await this.prisma.acheivement.update({
          where: { playerId: userId },
          data: { NewHero: true },
        });
      }
      if (user.wins === 3 && achievement.NewHero) {
        await this.prisma.acheivement.update({
          where: { playerId: userId },
          data: { Rak3ajbni: true },
        });
      }
      if (user.wins === 10 && achievement.Rak3ajbni && achievement.NewHero) {
        await this.prisma.acheivement.update({
          where: { playerId: userId },
          data: { Sbe3: true },
        });
      }
      if (
        user.wins === 50 &&
        achievement.Rak3ajbni &&
        achievement.NewHero &&
        achievement.Sbe3
      ) {
        await this.prisma.acheivement.update({
          where: { playerId: userId },
          data: { a9wedPonger: true },
        });
      }
      if (
        user.wins === 100 &&
        achievement.Rak3ajbni &&
        achievement.NewHero &&
        achievement.Sbe3 &&
        achievement.a9wedPonger
      ) {
        await this.prisma.acheivement.update({
          where: { playerId: userId },
          data: { GetAlifeBro: true },
        });
      }
    } catch (error) {}
  }

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
        orderBy: { createdAt: 'desc' },
        include: {
          Player: {
            select: {
              username: true,
            },
          },
          Opponent: {
            select: {
              username: true,
            },
          },
        },
      });
      return MatchHistory;
    } catch (error) {
      throw new BadRequestException('Invalid user data.');
    }
  }
}
