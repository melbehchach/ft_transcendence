import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class PlayerService {
  connectedPlayers: { [playerId: string]: any } = {};

  handleConnections(socket: Socket): void {
    const playerId = socket.id;
    this.connectedPlayers[playerId] = {};
    console.log('Socket Id: ', playerId);
  }

  handleDisconnects(socket: Socket): void {
    const playerId = socket.id;
    delete this.connectedPlayers[playerId];
  }
}
