import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
} from '@nestjs/websockets';
import { PrismaService } from '../prisma/prisma.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: "*",
    namespace: 'notifications',
})

export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    handleConnection(client: any, ...args: any[]) {
        const playeId = client.handshake.auth.token;
        if (playeId){
            // console.log(`Client connected: ${playeId}`);
        }
    }

    @SubscribeMessage("inviteToGame")
    handleinviteGame(payload : any){
        console.log(payload);
    }


    handleDisconnect(client: any) {
        const playeId = client.handshake.auth.token;
        if (playeId){
            // console.log(`Client disconnected: ${playeId}`);
        }
    }
}
