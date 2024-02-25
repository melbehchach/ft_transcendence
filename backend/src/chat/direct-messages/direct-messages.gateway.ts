import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { validateToken } from 'src/helpers/auth.helpers';
import { DirectMessageDto } from 'src/dto/message.dto';

@WebSocketGateway({ cors: { origin: '*' }, namespace: 'direct-messages' })
export class DirectMessagesGateway
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

  // Authenticating Clients
  async afterInit(client: Socket) {
    // this.logger.log(`SERVER STARTED`);
    client.use(async (req: any, next) => {
      try {
        const token =
          req.handshake.auth.jwt_token ?? req.handshake.headers.jwt_token;
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
            invitedChats: true,
            startedChats: true,
            receivedMessages: true,
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
    this.addClientToMap(this.user.id, client);
  }

  handleDisconnect(client: Socket) {
    this.deleteClientFromMap(client.id);
  }

  sendMessage(data: DirectMessageDto) {
    try {
      if (!data) {
        throw new WsException('invalid message data');
      }
      const receiver = this.clientsMap[data.receiverId];
      if (receiver) {
        receiver.forEach((client) => {
          client.emit('directMessage', {
            sender: data.senderId,
            body: data.body,
          });
        });
      }
    } catch (error) {
      // console.log(`Failed to send message: ${error.message}`);
      throw new WsException('Faild To Send Message');
    }
  }
}
