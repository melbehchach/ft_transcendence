import { NotificationsGateway } from "src/notifications/notifications.gateway";
import { NotificationsService } from "src/notifications/notifications.service";
import { PrismaService } from "src/prisma/prisma.service";
import { Injectable , BadRequestException} from "@nestjs/common";
import { GameType } from "@prisma/client";

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
      // we should also check if the sender and receiver are already friends
      // also if the receiver is not in game or he/she is offline
      this.notificationsService.createNotification(senderId, receiverId);
      this.notificationsGateway.handleNotificationEvent(senderId, receiverId);
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
      this.notificationsGateway.handleAcceptEvent(senderId, receiverId, game.id);
	  return game;
    }
    catch (error) {
      throw new BadRequestException('Invalid sender or receiver data.');
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
          Player: {
            select : {
              username: true,
            }
          }
          , 
          Opponent: {
            select : {
              username: true,
            }
          },
        },
      });
      return MatchHistory;
    } catch (error) {
      throw new BadRequestException('Invalid user data.');
    }
  }

}