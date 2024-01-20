import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { PrismaService } from '../prisma/prisma.service';
import { Server, Socket } from 'socket.io';
import { validateToken } from 'src/helpers/auth.helpers';
import { JwtService } from '@nestjs/jwt';
import { userStatus } from '@prisma/client';
// import { UserService } from './user.service';

@WebSocketGateway({ cors: '*', namespace: 'status' })
export class userGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    // private userService: UserService,
  ) {}

  @WebSocketServer() server: Server;
  private user: any;

  private clientsMap = {};

  async addClientToMap(userId: string, client: Socket) {
    if (!this.clientsMap[userId]) {
      // console.log(userId);
      this.clientsMap[userId] = new Set();
      this.clientsMap[userId].add(client);
      try {
        const user = await this.prisma.user.update({
          where: { id: userId },
          data: {
            status: userStatus.ONLINE,
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
        this.updateStatusEvent(user.id, user.status, friends);
        // return 'success';
      } catch (error) {
        throw new WsException(error.message);
      }
    } else {
      this.clientsMap[userId].add(client);
    }
  }

  async deleteClientFromMap(clientId: string) {
    Object.entries(this.clientsMap).forEach(
      async ([userId, clientSet]: [string, Set<Socket>]) => {
        for (const client of clientSet) {
          if (client.id === clientId) {
            clientSet.delete(client);
            break;
          }
        }
        if (clientSet.size === 0) {
          delete this.clientsMap[userId];
          try {
            const user = await this.prisma.user.update({
              where: { id: userId },
              data: {
                status: userStatus.OFFLINE,
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
            this.updateStatusEvent(user.id, user.status, friends);
            // return 'success';
          } catch (error) {
            throw new WsException(error.message);
          }
        }
      },
    );
  }

  async afterInit(client: Socket) {
    client.use(async (req: any, next) => {
      try {
        const token = req.handshake.headers.jwt_token;
        if (!token) {
          throw new WsException('Unauthorized: Token Not Provided');
        }
        // console.log(token);
        const payload = await validateToken(token, this.jwt);
        this.user = await this.prisma.user.findUnique({
          where: { id: payload?.sub || '' },
          select: {
            id: true,
          },
        });
        if (!payload || !this.user) {
          throw new WsException('Unauthorized: User Not Found');
        }
        next();
      } catch (error) {
        console.log(`Auth error: ${error.message}`);
        next(error);
      }
    });
  }

  async handleConnection(client: Socket) {
    await this.addClientToMap(this.user.id, client);
  }

  async handleDisconnect(client: any) {
    await this.deleteClientFromMap(client.id);
  }

  updateStatusEvent(user: string, status: userStatus, friends: string[]) {
    for (const index in friends) {
      if (this.clientsMap[friends[index]]) {
        this.clientsMap[friends[index]].forEach((client) => {
          client.emit('statusUpdate', {
            user,
            status,
          });
        });
      }
    }
  }
}
