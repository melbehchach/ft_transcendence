import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    ConnectedSocket,
} from '@nestjs/websockets';
import { PrismaService } from '../prisma/prisma.service';
// import { NotificationsController } from './notifications.controller';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: '*',
  namespace: 'notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private socketMap = new Map<string, any>();

  constructor(private prisma: PrismaService) {}

  handleConnection(client: any, ...args: any[]) {
    const playeId = client.handshake.auth.token;
    if (playeId) {
      const object = {
         id: client.id,
         socketobj: client,
      };
      if (!this.socketMap.has(playeId)) {
        this.socketMap.set(playeId, object);
      }
    }
  }

  @SubscribeMessage('notification')
  handleNotificationEvent(senderId: string, receiverId: string) {
    const sender = this.prisma.user.findUnique({
      where: {
        id: senderId,
      },
    });
    const receiver = this.prisma.user.findUnique({
      where: {
        id: receiverId,
      },
    });
    if (!sender || !receiver) {
      throw new Error('Sender or receiver not found');
    }
    const senderSocket = this.socketMap.get(senderId);
    if (senderSocket) {
       this.server.to(senderSocket.id).emit('notification', {
         message: "you're the sender",
         sender : senderId,
       });
    }
    const receiverSocket = this.socketMap.get(receiverId);
    if (receiverSocket) {
      this.server.to(receiverSocket.id).emit('notification', {
        message: "you're the receiver",
        receiver : receiverId,
        sender : senderId,
      });
    }
  }

  handleAcceptEvent(senderId: string, receiverId: string, gameId: string) {
    const senderSocket = this.socketMap.get(senderId);
    if (senderSocket) {
      this.server.to(senderSocket.id).emit('redirect', {
        url: `/game/friend/${gameId}`,
      });
    }
    const receiverSocket = this.socketMap.get(receiverId);
    if (receiverSocket) {
      this.server.to(receiverSocket.id).emit('redirect', {
        url: `/game/friend/${gameId}`,
      });
    }
  }

  handleDeclineEvent(senderId: string, receiverId: string) {
    const senderSocket = this.socketMap.get(senderId);
    if (senderSocket) {
      this.server.to(senderSocket.id).emit('DeclineGame', {
        message: 'Game request declined',
      });
    }
    const receiverSocket = this.socketMap.get(receiverId);
    if (receiverSocket) {
      this.server.to(receiverSocket.id).emit('DeclineGame', {
        message: 'Game request declined',
      });
    }
  }

  handleDisconnect(client: any) {
    const playeId = client.handshake.auth.token;
    if (playeId) {
      if (this.socketMap.has(playeId)) {
        this.socketMap.delete(playeId);
      }
    }
  }
}
