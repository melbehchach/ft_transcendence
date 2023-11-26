import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GameService {

  private roomGame: Map<string, string[]> = new Map();

  createRoom(): string {
    const roomName = uuidv4();
    this.roomGame.set(roomName, []);
    return roomName;
  }

  getRoomName(): string {
    return Array.from(this.roomGame.keys())[0];
  }

  addPlayerToRoom(roomName: string, playerId: string): string[] {
    const players = this.roomGame.get(roomName);
    if (players.length === 2) {
      throw new Error('Room is already full');
    }
    players.push(playerId);
    return players;
  }

  removePlayerFromRoom(roomName: string, playerId: string): void {
    this.roomGame.set(
      roomName,
      this.roomGame.get(roomName).filter((id) => id !== playerId),
    );
  }

  getPlayersInRoom(roomName: string){
    if (!roomName)
      return this.roomGame.get(roomName);
  }

  checkIfRoomIsFull(roomName: string): boolean {
    return this.roomGame.get(roomName).length === 2;
  }

  checkIfRoomExists(roomName: string): boolean {
    return this.roomGame.has(roomName);
  }
}
