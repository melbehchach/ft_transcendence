import { Injectable } from '@nestjs/common';
import { GameService } from './game.service';
import { Socket } from 'socket.io';

@Injectable()
export class PlayerService {
  constructor(private GameRoom: GameService) {}
  connectedPlayers = {};
  handleConnections(socket: Socket): void {
    try {
      const PedalX = Math.random() * 1000;
      const PedalY = Math.random() * 1000;
      this.connectedPlayers[socket.id] = {
        playerId: socket.id,
        x: PedalX,
        y: PedalY,
      };
      socket.emit('Connection', {
        id: socket.id,
        x: PedalX,
        y: PedalY,
      });
    } catch (error) {
      console.error('Error handling connection:', error);
    }
  }

  handleJoinsGame(socket: Socket): void {
    try {
      const roomName = this.GameRoom.createRoom();
      this.GameRoom.addPlayerToRoom(roomName, socket.id);
      if (this.GameRoom.getPlayersInRoom(roomName).length === 2) {
        socket.join(roomName);
      }
    } catch (error) {
      console.error('Error joining the room game:', error);
    }
  }

  handleDisconnects(socket: Socket): void {
    try {
      socket.on('disconnect', () => {
        delete this.connectedPlayers[socket.id];
        socket.emit('playerDisconnected', { id: socket.id });
      });
    } catch (error) {
      console.error('Error handling disconnection:', error);
    }
  }
}
