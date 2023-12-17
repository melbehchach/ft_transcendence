import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
} from '@nestjs/websockets';
import { PrismaService } from '../prisma/prisma.service';
// import { NotificationsController } from './notifications.controller';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: "*",
    namespace: 'notifications',
})

export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private socketMap = new Map<string, Socket>();
    constructor(private prisma: PrismaService) {}
    handleConnection(client: any, ...args: any[]) {
        const playeId = client.handshake.auth.token;
        if (playeId){
            if (!this.socketMap.has(playeId)){
               this.socketMap.set(playeId, client);
            }
        }
    }

    handleNotificationEvent(event: any) {
        // until we have a better way to do this , maybe tomorrow we will have a better way
    }

    handleDisconnect(client: any) {
        const playeId = client.handshake.auth.token;
        if (playeId){
            if (this.socketMap.has(playeId)){
               this.socketMap.delete(playeId);
            }
        }
    }
}
