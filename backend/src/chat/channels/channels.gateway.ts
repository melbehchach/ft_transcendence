import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  // SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { validateToken } from 'src/helpers/auth.helpers';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { WsException } from '@nestjs/websockets';
import { ChannelMessageDto } from 'src/dto/message.dto';
// import { MessageService } from '../message/message.service';
// import { Logger } from '@nestjs/common';
// import { User } from '@prisma/client';

@WebSocketGateway({ cors: { origin: '*' }, namespace: 'channels' })
export class ChannelsGateway
  implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection
{
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  // private logger = new Logger(ChannelsGateway.name);
  @WebSocketServer() server: Server;
  private user: any;

  private clientsMap = {};
  addClientToMap(userId: string, client: Socket) {
    if (!this.clientsMap[userId]) {
      // client.join(this.user.username);
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
  // getClientFromMap(userId: string) {
  //   return this.clientsMap[userId] || new Set();
  // }

  // Authenticating Clients
  async afterInit(client: Socket) {
    // this.logger.log(`SERVER STARTED`);
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
        console.log(`Auth error: ${error.message}`);
        next(error);
      }
    });
  }

  handleConnection(client: Socket) {
    // const { sockets } = this.server.sockets;
    const channels = this.user.ChannelsMember;

    this.addClientToMap(this.user.id, client);
    // client.join(this.user.id);
    console.log(this.user.username + ' channels:', channels);
    channels.forEach((channel) => {
      client.join(channel.id);
      channel.Messages.forEach((msg) => {
        if (!msg.delivered) {
          this.server
            .to(channel.id)
            .emit('channelMessage', { sender: msg.senderId, body: msg.body });
        }
      });
    });
    console.log(`${client.id} joined`);
    console.log(this.clientsMap);
  }

  handleDisconnect(client: any) {
    // const { sockets } = this.server.sockets;
    this.deleteClientFromMap(client.id);
    console.log(`${client.id} left`);
    // console.log(`${sockets?.size || 0} Connected Clients`);
  }

  newRoom(channelId: string, channelName: string, members: string[]) {
    try {
      if (!members || members.length === 0) {
        console.log(`Failed to make room: empty members list`);
        return null;
      }
      for (const index in members) {
        if (this.clientsMap[members[index]]) {
          this.clientsMap[members[index]].forEach((client) => {
            client.join(channelId);
            client.emit('joinRoom', { channelId });
            console.log(`${members[index]} added to ${channelName}`);
          });
        }
      }
      return { msg: 'OK' };
    } catch (error) {
      console.log(`Failed to create room: ${error.message}`);
      // return null;
      throw new WsException('Failed to create room');
    }
  }

  joinRoom(channelId: string, channelName: string, userId: string) {
    try {
      if (this.clientsMap[userId]) {
        this.clientsMap[userId].forEach((client) => {
          client.join(channelId);
          client.emit('joinRoom', { channelId });
          console.log(`${userId} added to ${channelName}`);
        });
      }
    } catch (error) {
      console.log(`Failed to joinRomm ${channelName}`);
      // return null;
      throw new WsException('Failed to joinRomm');
    }
  }

  leaveRoom(channelId: string, channelName: string, userId: string) {
    try {
      if (this.clientsMap[userId]) {
        this.clientsMap[userId].forEach((client) => {
          client.leave(channelId);
          client.emit('leaveRoom', { channelId });
          console.log(`${userId} left ${channelName}`);
        });
      }
    } catch (error) {
      console.log(`Failed to leaveRoom ${channelName}`);
      // return null;
      throw new WsException('Failed to leaveRoom');
    }
  }

  // @SubscribeMessage('channelMessage')
  sendMessage(data: ChannelMessageDto) {
    try {
      if (!data) {
        throw new WsException('invalid message data');
      }
      this.server
        .to(data.channelId)
        .emit('channelMessage', { sender: data.senderId, body: data.body });
    } catch (error) {
      console.log(`Failed to send message: ${error.message}`);
      throw new WsException('Faild To Send Message');
    }
  }
}
