import { Injectable } from '@nestjs/common';

@Injectable()
export class GameService {
  private roomGame: Map<string, any> = new Map<string, any>();

  createRoomGame(roomName: string): void {
    this.roomGame.set(roomName, []);
  }

  addPlayerToRoom(roomName: string, playerId: string): void {
    if (this.roomGame.has(roomName)) {
      this.roomGame.get(roomName).push(playerId);
    }
  }

  removePlayerFromGameRoom(roomName: string, playerId: string) {
    if (this.roomGame.has(roomName)) {
      const players = this.roomGame.get(roomName);
      const index = players.indexOf(playerId);
      if (index !== -1) {
        players.splice(index, 1);
      }
    }
  }

  getPlayersInGameRoom(roomName: string) {
    return this.roomGame.get(roomName) || [];
  }
}
