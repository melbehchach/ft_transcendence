import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class PlayerService {
  private connectedPlayers: { [playerId: string]: Socket } = {};

  handleConnections(socket: Socket): void {
    const playerId = socket.id;
    this.connectedPlayers[playerId] = socket;
  }

  handleDisconnects(socket: Socket): void {
    const playerId = socket.id;
    delete this.connectedPlayers[playerId];
  }
}
