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

  async UnlockAchievements(userId: string, achievementCondition: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { acheivements: true },
      });

      if (!user) {
        throw new BadRequestException('Invalid user data.');
      }

      if (
        user.acheivements.some(
          (achievement) => achievement.description === achievementCondition,
        )
      ) {
        throw new BadRequestException('Achievement already unlocked.');
      }

      if (this.checkAchievement(achievementCondition, userId)) {
        await this.prisma.user.update({
          where: { id: userId },
          data: {
            acheivements: {
              create: {
                description: achievementCondition,
              },
            },
          },
        });
      }
      this.notificationsGateway.handleNotificationEvent(
        NotificationType.Acheivement,
        userId,
        `You have unlocked new ${achievementCondition}`,
      );
    } catch (error) {
      throw error;
    }
  }

  private checkAchievement(
    achievementCondition: number,
    user: string,
  ): Promise<boolean> {
    switch (achievementCondition) {
      case 1:
        return this.checkSingleWin(user);
      case 3:
        return this.checkThreeWins(user);
      case 10:
        return this.checkTenWins(user);
      case 50:
        return this.checkFiftyWins(user);
      case 100:
        return this.checkHundredWins(user);
      default:
        return Promise.resolve(false);
    }
  }

  private async checkSingleWin(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('Invalid user data.');
    }
    return user.win === 1;
  }

  private async checkThreeWins(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('Invalid user data.');
    }
    return user.win === 3;
  }

  private async checkTenWins(userId: any): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('Invalid user data.');
    }
    return user.win === 10;
  }

  private async checkFiftyWins(userId: any): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('Invalid user data.');
    }
    return user.win === 50;
  }

  private async checkHundredWins(userId: any): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('Invalid user data.');
    }
    return user.win === 100;
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
