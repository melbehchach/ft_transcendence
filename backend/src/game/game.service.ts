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

      if (!sender || !receiver || receiver?.friends?.length === 0) {
        throw new Error('Internal Server Error: cannotSendGameRequest');
      }
      this.notificationsGateway.handleNotificationEvent(
        NotificationType.GameRequest,
        receiverId,
        {receiverId, senderId, sender: sender.username},
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
      // console.log('FROM GAME SERVICE'); 
      return game;
    } catch (error) {
      // console.log(error);
    }
  }

  async declineGameRequest(senderId: string, receiverId: string) {
    try {
      this.notificationsGateway.handleDeclineEvent(senderId, receiverId);
    } catch (error) {
      // console.log(error);
    }
  }

  async getGame(playerId: string) {
    try {
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
      if (!game) {
        throw new Error('Game not found');
      }
      return game;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getCurrentGame(playerId: string) {
    try {
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
      if (!game) {
        throw new Error('Game not found');
      }
      return game;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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
      if (!user) {
        throw new Error('Invalid User');
      }
      return user?.loses;
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
      if (!user) {
        throw new Error('Invalid User');
      }
      return user?.wins;
    } catch (error) {
      throw new BadRequestException(error.message);
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

      if (!user) {
        // console.log('no user');
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

  async getTotalGames(userId: string): Promise<number> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          Playerat: true,
          Opponentat: true,
        },
      });
      if (!user) {
        throw new Error('invalid user');
      }
      let totalGames = 0;
      totalGames += user.Playerat ? user.Playerat.length : 0;
      totalGames += user.Opponentat ? user.Opponentat.length : 0;
      return totalGames;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getTotalAchievement(userId: string): Promise<number> {
    const userWithAchievements = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        achievements: true,
      },
    });

    if (!userWithAchievements || !userWithAchievements.achievements) {
      return 0;
    }

    const achievements = userWithAchievements.achievements;
    let count = 0;
    for (const key of Object.keys(achievements)) {
      if (achievements[key] === true) {
        count += 1;
      }
    }
    return count;
  }

  async getAchievements(id: string) {
    try {
      const achievement = await this.prisma.achievement.findUnique({
        where: { playerId: id },
        select: {
          freshman: true,
          snowdedn: true,
          NewHero: true,
          Rak3ajbni: true,
          Sbe3: true,
          a9wedPonger: true,
          GetAlifeBro: true,
        },
      });
      if (!achievement) {
        throw new Error('achievement not found');
      }
      return achievement;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
