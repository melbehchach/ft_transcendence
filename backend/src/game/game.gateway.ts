import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { PlayerService } from './Player.service';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: '*',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  io: Server;

  constructor(
    private readonly playerService: PlayerService,
    private readonly gameService: GameService,
  ) {}

  handleConnection(client: Socket): void {
    this.playerService.handleConnections(client);
    this.handleJoinGame(client);
    console.log('Player joined the game: ', client.id);
  }

  handleJoinGame(client: Socket): void {
    this.playerService.handleJoinsGame(client);
    const roomName = this.gameService.createRoom();
    console.log('Room name: ', roomName);
  }

  handleDisconnect(client: Socket): void {
    this.playerService.handleDisconnects(client);
  }
}
