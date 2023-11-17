import { Injectable } from '@nestjs/common';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';

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

// @Injectable()
// export class PlayerService {
// 	private ConnectedPlayers: playerQueue;
// 	private waitingPlayers: any[];
// 	private GameRooms: string;
// 	private playerObject1: any;
// 	private playerObject2: any;
// 	private playersObjects: any;
// 	private ballObjects: any;
// 	private canvasWidth: number = 1080;
// 	private canvasHeight: number = 720;
// 	private isWaiting: boolean = false;
// 	constructor(private GameRoom: GameService) {
// 		this.ConnectedPlayers = new playerQueue();
// 		this.GameRooms = '';
// 		this.playerObject1 = null;
// 		this.playerObject2 = null;
// 		this.playersObjects = null;
// 	}
// 	handleConnections(socket: Socket): void {
// 		try {
// 			if (!this.ConnectedPlayers)
// 				this.ConnectedPlayers = new playerQueue();
// 			if (!this.playerObject1) {
// 				this.playerObject1 = {
// 					player1Id: socket.handshake.auth.token,
// 					username1: '',
// 					socket1Id: socket.id,
// 					PosPlayer1: 500,
// 					score1Player: 0,
// 					isInGame: false,
// 				};
// 				// console.log('this.playerObject1: ', this.playerObject1);
// 			}
// 			else if (!this.playerObject2) {
// 				this.playerObject2 = {
// 					player2Id: socket.handshake.auth.token,
// 					username2: '',
// 					socket2Id: socket.id,
// 					PosPlayer2: 500,
// 					score2Player: 0,
// 					isInGame: false,
// 				};
// 				// console.log('this.playerObject2: ', this.playerObject2);
// 			}
// 			if (this.playerObject1 && this.playerObject2) {
// 				this.GameRooms = this.GameRoom.createRoom();
// 				this.playersObjects = {
// 					playerId1: this.playerObject1.player1Id,
// 					playerId2: this.playerObject2.player2Id,
// 					player1Pos: this.playerObject1.PosPlayer1,
// 					player2Pos: this.playerObject2.PosPlayer2,
// 					player1score: this.playerObject1.score1Player,
// 					player2score: this.playerObject2.score2Player,
// 					Room: this.GameRooms,
// 					gameStatus: false,
// 				};
// 				this.ballObjects = {
// 					ballX: this.canvasWidth / 2,
// 					ballY: this.canvasHeight / 2,
// 					BallvelX: 5,
// 					BallvelY: 5,
// 					ballRadius: 10,
// 				};
// 				this.ConnectedPlayers.addToQueue(this.playersObjects);
// 				// console.log('before this.ConnectedPlayers: ', this.ConnectedPlayers.connectedPlayers);
// 				if (this.ConnectedPlayers && this.ConnectedPlayers.connectedPlayers[0]) {
// 					socket.join(this.ConnectedPlayers.connectedPlayers[0].Room);
// 					socket.emit('playerReady', this.playersObjects);
// 					socket.emit('ballData', this.ballObjects);
// 					// console.log(this.ballObjects)
// 					// console.log('this.ConnectedPlayers: ', this.playersObjects);
// 					// this.ConnectedPlayers.removeFirst();
// 				}
// 				// this.playerObject1 = null;
// 				// this.playerObject2 = null;
// 				// this.playersObjects = null;
// 				// this.playersObjects = null;
// 				// this.GameRooms = '';
// 			}
// 		}
// 		catch (error) {
// 			console.error('Error handling connection:', error);
// 		}
// 	}

// 	movePaddle(socket : Socket, payload: any, io : Server): void {
// 		try{
// 			if (payload.key === 'ArrowUp') {
// 				this.playersObjects.player1Pos -= 90;
// 				io.to(this.ConnectedPlayers.connectedPlayers[0].Room).emit('Up', {key: 'ArrowUp', player1Pos: this.playersObjects.player1Pos, id : payload.id})
// 			}
// 			else if (payload.key === 'ArrowDown') {
// 				this.playersObjects.player1Pos += 90;
// 				io.to(this.ConnectedPlayers.connectedPlayers[0].Room).emit('Up', {key: 'ArrowDown', player1Pos: this.playersObjects.player1Pos, id : payload.id})
// 			}
// 		}
// 		catch (error){
// 			console.error('Error handling paddle mouvement:', error);
// 		}
// 	}

// 	handleDisconnections(socket: Socket): void {
// 		try {
// 			socket.on('disconnect', () => {
// 				socket.emit('playerDisconnected', { id: socket.id });
// 			});
// 		} catch (error) {
// 			console.error('Error handling disconnection:', error);
// 		}
// 	}
// }

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

@Injectable()
export class PlayerService {
	public ConnectedPlayers: playerQueue;
	public waitingPlayers: any[] = [];
	public playerObject1: any;
	public playerObject2: any;
	public playersObjects: any;
	public ballObjects: any;
	public canvasWidth: number = 1080;
	public canvasHeight: number = 720;
	public isWaiting: boolean = false;
	constructor(private GameRoom: GameService) { }
	handleJoinsGame(socket: Socket): void {
		const player1Id = socket.handshake.auth.token;
		const player2Id = socket.handshake.auth.token;
		if (player1Id != '' && player2Id)
			this.waitingPlayers.push({ player1Id, player2Id });
		if (this.waitingPlayers.length >= 2) {
			if (!this.ConnectedPlayers)
				this.ConnectedPlayers = new playerQueue();
			if (!this.playerObject1) {
				this.playerObject1 = {
					player1Id: this.waitingPlayers[0].player1Id,
					username1: '',
					socket1Id: socket.id,
					PosPlayer1: 500,
					score1Player: 0,
					isInGame: false,
				};
			} else if (!this.playerObject2) {
				this.playerObject2 = {
					player2Id: this.waitingPlayers[1].player2Id,
					username2: '',
					socket2Id: socket.id,
					PosPlayer2: 500,
					score2Player: 0,
					isInGame: false,
				};
			}
			if (this.playerObject1 && this.playerObject2) {
				const room = this.GameRoom.createRoom();
				this.playersObjects = {
					playerId1: this.playerObject1.player1Id,
					playerId2: this.playerObject2.player2Id,
					player1Pos: this.playerObject1.PosPlayer1,
					player2Pos: this.playerObject2.PosPlayer2,
					player1score: this.playerObject1.score1Player,
					player2score: this.playerObject2.score2Player,
					Room: room,
					gameStatus: false,
				};
				this.ballObjects = {
					ballX: this.canvasWidth / 2,
					ballY: this.canvasHeight / 2,
					BallvelX: 5,
					BallvelY: 5,
					ballRadius: 10,
				};
				this.ConnectedPlayers.addToQueue(this.playersObjects);
				if (this.ConnectedPlayers && this.ConnectedPlayers.connectedPlayers[0]) {
					socket.join(this.ConnectedPlayers.connectedPlayers[0].Room);
					socket.emit('playerReady', this.playersObjects);
					socket.emit('ballData', this.ballObjects);
					// console.log('this.ConnectedPlayers: ', this.ConnectedPlayers.connectedPlayers);
				}
			};
		}
	}
	movePaddle(socket: Socket, payload: any, io: Server): void {
		try {
			if (payload.key === 'ArrowUp') {
				this.playersObjects.player1Pos -= 90;
				io.to(this.ConnectedPlayers.connectedPlayers[0].Room).emit('Up', { key: 'ArrowUp', player1Pos: this.playersObjects.player1Pos, id: payload.id })
			}
			else if (payload.key === 'ArrowDown') {
				this.playersObjects.player1Pos += 90;
				io.to(this.ConnectedPlayers.connectedPlayers[0].Room).emit('Up', { key: 'ArrowDown', player1Pos: this.playersObjects.player1Pos, id: payload.id })
			}
			else if (payload.key === ' ') {
				io.to(this.ConnectedPlayers.connectedPlayers[0].Room).emit('Up', this.ballObjects)
			}
		}
		catch (error) {
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
