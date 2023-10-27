import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { PlayerService } from './Player.service';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: '*',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(private readonly playerService: PlayerService) {}
  handleConnection(client: any): void {
    this.playerService.handleConnections(client);
  }
  sendToClients(message: string) {
    this.server.emit('message', message);
  }
  handleDisconnect(client: any): void {
    this.playerService.handleDisconnects(client);
  }
}
