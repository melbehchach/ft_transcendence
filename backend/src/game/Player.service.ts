import { Injectable } from '@nestjs/common';
import { GameService } from './game.service';
import { Socket } from 'socket.io';
import { on } from 'events';

class playerQueue {
	connectedPlayers: any[];

	constructor() {
		this.connectedPlayers = [];
	}

	addToQueue(playerObject: any): void {
		this.connectedPlayers.push({ playerObject });
	}

	getAllPlayers(): any[] {
		return this.connectedPlayers;
	}

	getFirst(): any {
		if (this.isEmpty())
			throw new Error('Queue is empty');
		return this.connectedPlayers[0];
	}

	removeFirst(): void {
		if (this.isEmpty())
			throw new Error('Queue is empty');
		this.connectedPlayers.shift();
	}

	isEmpty(): boolean {
		return this.connectedPlayers.length === 0;
	}

	getSize(): number {
		return this.connectedPlayers.length;
	}
}

@Injectable()
export class PlayerService {
	private ConnectedPlayers: playerQueue;
	private waitingPlayers: any[];
	private GameRooms: string;
	private playerObject1: any;
	private playerObject2: any;
	private playersObjects: any;
	constructor(private GameRoom: GameService) {
		this.ConnectedPlayers = new playerQueue();
		this.GameRooms = '';
		this.playerObject1 = null;
		this.playerObject2 = null;
		this.playersObjects = null;
	}
	handleConnections(socket: Socket): void {
		try {
			if (!this.ConnectedPlayers)
				this.ConnectedPlayers = new playerQueue();
			if (!this.playerObject1) {
				this.playerObject1 = {
					player1Id: socket.handshake.auth.token,
					username1: '',
					socket1Id: socket.id,
					PosPlayer1: 100,
					score1Player: 0,
					isInGame: false,
				};
				// console.log('this.playerObject1: ', this.playerObject1);
			}
			else if (!this.playerObject2) {
				this.playerObject2 = {
					player2Id: socket.handshake.auth.token,
					username2: '',
					socket2Id: socket.id,
					PosPlayer2: 500,
					score2Player: 0,
					isInGame: false,
				};
				// console.log('this.playerObject2: ', this.playerObject2);
			}
			if (this.playerObject1 && this.playerObject2) {
				this.GameRooms = this.GameRoom.createRoom();
				this.playersObjects = {
					playerId1: this.playerObject1.player1Id,
					playerId2: this.playerObject2.player2Id,
					player1Pos: this.playerObject1.PosPlayer1,
					player2Pos: this.playerObject2.PosPlayer2,
					player1score: this.playerObject1.score1Player,
					player2score: this.playerObject2.score2Player,
					ballX: 0,
					ballY: 0,
					Room: this.GameRooms,
					gameStatus: false,
				};
				this.ConnectedPlayers.addToQueue(this.playersObjects);
				// console.log('before this.ConnectedPlayers: ', this.ConnectedPlayers.connectedPlayers);
				if (this.ConnectedPlayers && this.ConnectedPlayers.connectedPlayers[0]) {
					socket.join(this.ConnectedPlayers.connectedPlayers[0].Room);
					socket.emit('playerReady', this.playersObjects);
					// console.log('this.ConnectedPlayers: ', this.playersObjects);
					// this.ConnectedPlayers.removeFirst();
				}
				// this.playerObject1 = null;
				// this.playerObject2 = null;
				// this.playersObjects = null;
				// this.playersObjects = null;
				// this.GameRooms = '';
			}
		}
		catch (error) {
			console.error('Error handling connection:', error);
		}
	}

	movePaddleUp(socket: Socket, payload: any): void {
		try{
			if (this.playersObjects.playerId1 === payload.id1) {
				this.playersObjects.player1Pos += 10;
				socket.to(this.playersObjects.Room).emit('Up', this.playersObjects.player1Pos);
			}
			else if (this.playersObjects.playerId2 === payload.id2) {
				this.playersObjects.player2Pos += 10;
				socket.to(this.playersObjects.Room).emit('Up', this.playersObjects.player2Pos);
			}
		}
		catch (error){
			console.error('Error handling paddle mouvement:', error);
		}

	}

	handleDisconnections(socket: Socket): void {
		try {
			socket.on('disconnect', () => {
				socket.emit('playerDisconnected', { id: socket.id });
			});
		} catch (error) {
			console.error('Error handling disconnection:', error);
		}
	}
}

// handleJoinsGame(Socket : Socket, curentUser : string, playerId : string, room: string): void {
// // const curentUser
// // socket extuct athentification token that represent the current user
// // invite => id1, id2 (if playerId isn't empty)
// // if the user in id2 is connected and not inGame then  you can invite him
// // which means that you will emit an event to the user with the id of the user that invited him
// // and you'll be listening to the replay event in backend
// // remove from queue if someone of them exists [{socket: Socket, id: string}, {socket: Socket, id: string}]
// // in game : objectGame => [{socket: Socket, id: string}, {socket: Socket, id: string}]
// // if playerId is empty == Random
// // check the queue if there is someone waiting for a game
// // if there is someone waiting for a game then you'll be playing with him
// // and you'll pop them from the queue
// // and you'll push the two players in the game array