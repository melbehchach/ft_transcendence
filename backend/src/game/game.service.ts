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
        `${sender.username} wants to challenge you.`,
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

  async getGame(playerId: string) {
    const game = await this.prisma.game.findFirst({
      where: {
        OR: [
          {
            Player: {
              id: playerId,
            },
          },
          {
            Opponent: {
              id: playerId,
            },
          },
        ],
      },
    });
    return game;
  }

  async getCurrentGame(playerId: string) {
    const game = await this.prisma.game.findFirst({
      where: {
        OR: [
          {
            Player: {
              id: playerId,
            },
          },
          {
            Opponent: {
              id: playerId,
            },
          },
        ],
      },
      include: {
        Player: {
          select: {
            username: true,
            avatar: true,
          },
        },
        Opponent: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });
    return game;
  }

  async getPlayerLoses(playerId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: playerId,
        },
        select: {
          loses: true,
        },
      });
      return user.loses;
    } catch (error) {
      throw new BadRequestException('Cannot get player loses');
    }
  }

  async getPlayerWins(playerId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: playerId,
        },
        select: {
          wins: true,
        },
      });
      return user.wins;
    } catch (error) {
      throw new BadRequestException('Cannot get player wins');
    }
  }

  async endGame(winnerId: string, loserId: string) {
    try {
      let totalWins = 0;
      let totalloses = 0;
      const game = await this.getGame(winnerId);
      if (game) {
        if (game.playerId === winnerId) {
          totalWins += 1;
        }
        if (game.opponentId === winnerId) {
          totalWins += 1;
        }
        if (game.playerId === loserId) {
          totalloses += 1;
        }
        if (game.opponentId === loserId) {
          totalloses += 1;
        }
      }
      await this.prisma.user.update({
        where: { id: winnerId },
        data: {
          wins: {
            increment: totalWins,
          },
        },
      });
      await this.prisma.user.update({
        where: { id: loserId },
        data: {
          loses: {
            increment: totalloses,
          },
        },
      });
      this.unlockAchievement(winnerId);
    } catch (error) {
      throw new BadRequestException('Error ending game');
    }
  }

  async unlockAchievement(winnerId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: winnerId,
        },
        select: {
          wins: true,
        },
      });

      let achievement = await this.prisma.achievement.findFirst({
        where: {
          playerId: winnerId,
        },
      });

      if (!achievement) {
        achievement = await this.prisma.achievement.create({
          data: {
            playerId: winnerId,
            NewHero: false,
            Rak3ajbni: false,
            Sbe3: false,
            a9wedPonger: false,
            GetAlifeBro: false,
          },
        });
      }
      if (!user) {
        console.log('no user');
        return;
      }
      achievement.NewHero = user.wins >= 1 ? true : false;
      achievement.Rak3ajbni = user.wins >= 3 ? true : false;
      achievement.Sbe3 = user.wins >= 10 ? true : false;
      achievement.a9wedPonger = user.wins >= 50 ? true : false;
      achievement.GetAlifeBro = user.wins >= 100 ? true : false;

      await this.prisma.achievement.update({
        where: {
          playerId: winnerId,
        },
        data: {
          NewHero: achievement.NewHero,
          Rak3ajbni: achievement.Rak3ajbni,
          Sbe3: achievement.Sbe3,
          a9wedPonger: achievement.a9wedPonger,
          GetAlifeBro: achievement.GetAlifeBro,
        },
      });
      this.notificationsGateway.handleNotificationEvent(
        NotificationType.Acheivement,
        winnerId,
        "You've unlocked a new achievement! Congratulations !",
      );
    } catch (error) {
      throw new BadRequestException('Error unlocking achievement');
    }
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
