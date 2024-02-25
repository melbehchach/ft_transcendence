import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { validateToken } from 'src/helpers/auth.helpers';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { WsException } from '@nestjs/websockets';
import { ChannelMessageDto } from 'src/dto/message.dto';

@WebSocketGateway({ cors: { origin: '*' }, namespace: 'channels' })
export class ChannelsGateway
  implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection
{
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @WebSocketServer() server: Server;
  private user: any;

  private clientsMap = {};
  addClientToMap(userId: string, client: Socket) {
    if (!this.clientsMap[userId]) {
      this.clientsMap[userId] = new Set();
    }
    this.clientsMap[userId].add(client);
  }
  deleteClientFromMap(clientId: string) {
    Object.entries(this.clientsMap).forEach(
      ([userId, clientSet]: [string, Set<Socket>]) => {
        for (const client of clientSet) {
          if (client.id === clientId) {
            clientSet.delete(client);
            break;
          }
        }
        if (clientSet.size === 0) {
          delete this.clientsMap[userId];
        }
      },
    );
  }

  // Authenticating Clients
  async afterInit(client: Socket) {
    client.use(async (req: any, next) => {
      try {
        const token =
          req.handshake.auth.jwt_token ?? req.handshake.headers.jwt_token;
        if (!token) {
          throw new WsException('Unauthorized: Token Not Provided');
        }
        const payload = await validateToken(token, this.jwt);
        this.user = await this.prisma.user.findUnique({
          where: { id: payload?.sub || '' },
          select: {
            id: true,
            username: true,
            ChannelsMember: {
              include: {
                Messages: true,
              },
            },
          },
        });
        if (!payload || !this.user) {
          throw new WsException('Unauthorized: User Not Found');
        }
        next();
      } catch (error) {
        next(error);
      }
    });
  }

  handleConnection(client: Socket) {
    const channels = this.user.ChannelsMember;

    this.addClientToMap(this.user.id, client);
    channels.forEach((channel) => {
      client.join(channel.id);
    });
  }

  handleDisconnect(client: any) {
    this.deleteClientFromMap(client.id);
  }

  newRoom(channelId: string, channelName: string, members: string[]) {
    try {
      if (!members || members.length === 0) {
        // console.log(`Failed to make room: empty members list`);
        return null;
      }
      for (const index in members) {
        if (this.clientsMap[members[index]]) {
          this.clientsMap[members[index]].forEach((client) => {
            client.join(channelId);
            client.emit('joinRoom', { channelId });
          });
        }
      }
      return { msg: 'OK' };
    } catch (error) {
      // console.log(`Failed to create room: ${error.message}`);
      throw new WsException('Failed to create room');
    }
  }

  joinRoom(channelId: string, channelName: string, userId: string) {
    try {
      if (this.clientsMap[userId]) {
        this.clientsMap[userId].forEach((client) => {
          client.join(channelId);
          client.emit('joinRoom', { channelId });
        });
      }
    } catch (error) {
      // console.log(`Failed to joinRomm ${channelName}`);
      throw new WsException('Failed to joinRomm');
    }
  }

  leaveRoom(channelId: string, channelName: string, userId: string) {
    try {
      if (this.clientsMap[userId]) {
        this.clientsMap[userId].forEach((client) => {
          client.leave(channelId);
          client.emit('leaveRoom', { channelId });
        });
      }
    } catch (error) {
      // console.log(`Failed to leaveRoom ${channelName}`);
      throw new WsException('Failed to leaveRoom');
    }
  }

  async sendMessage(data: ChannelMessageDto) {
    try {
      if (!data) {
        throw new WsException('invalid message data');
      }
      const sender = await this.prisma.user.findUnique({
        where: { id: data.senderId },
        select: {
          id: true,
          blockedByUsers: {
            select: {
              id: true,
            },
          },
          blockedUsers: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!sender) {
        throw new WsException('sender record not found');
      }
      const blockedUsersIds = []
        .concat(sender.blockedByUsers.map((user) => user.id))
        .concat(sender.blockedUsers.map((user) => user.id));
      blockedUsersIds.map((id) => {
        this.clientsMap[id].forEach((client) => {
          client.join('BlockedUsers');
        });
      });
      this.server
        .except('BlockedUsers')
        .to(data.channelId)
        .emit('channelMessage', { sender: data.senderId, body: data.body });
      blockedUsersIds.map((id) => {
        this.clientsMap[id].forEach((client) => {
          client.leave('BlockedUsers');
        });
      });
    } catch (error) {
      // console.log(`Failed to send message: ${error.message}`);
      throw new WsException(`Faild To Send Message: ${error.message}`);
    }
  }
}
