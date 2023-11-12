import { Injectable } from '@nestjs/common';
import { GameService } from './game.service';
import { Socket } from 'socket.io';

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
	constructor(private GameRoom: GameService) { }
	private ConnectedPlayers: playerQueue;
	private ArrayOfPlayers: any[];
	private GameRooms: string;
	private playerObject1: any = null;
	private playerObject2: any = null;
	private playersObjects: any = null;
	handleConnections(client: Socket): void {
		try {	
			console.log('id', client.handshake.auth.token);
		}
		catch (error) {
			console.error('Error handling connection:', error);
		}
	}

	// movePaddleUp(payload : any, client: Socket, socket: any): void {
	// 	console.log(this.ConnectedPlayers.getAllPlayers());
	// 	const playerC = this.ConnectedPlayers.getAllPlayers().
	// 		map((p) => {if (p.playerObject.playerId1 == client.handshake.auth.token || p.playerObject.playerId2 == client.handshake.auth.token) return p;})[0];
	// 	console.log('payload: ', payload);
	// 	console.log('playerC: ', playerC);
	// 	if (payload.playerId === playerC.playerId1){
	// 		console.log('playerC.player1Pos:');
	// 		playerC.player1Pos += 10;
	// 	}
	// 	else {
	// 		console.log('playerC.player2Pos:');
	// 		playerC.player2Pos += 10;
	// 	}
	// 	socket.to(playerC.Room).emit('Up', this.playersObjects);
	// 	// this.playersObjects.socket1Id.emit('Up', this.playersObjects);
	// 	// this.playersObjects.socket2Id.emit('Up', this.playersObjects);
	// }

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
// // and you'll be listening to the replay event in  backend
// // remove from queue if someone of them exists [{socket: Socket, id: string}, {socket: Socket, id: string}]
// // in game : objectGame => [{socket: Socket, id: string}, {socket: Socket, id: string}]
// // if playerId is empty == Random
// // check the queue if there is someone waiting for a game
// // if there is someone waiting for a game then you'll be playing with him
// // and you'll pop them from the queue
// // and you'll push the two players in the game array


import { Injectable } from '@nestjs/common';
import { GameService } from './game.service';
import { Socket } from 'socket.io';

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
	constructor(private GameRoom: GameService) { }
	private ConnectedPlayers: playerQueue;
	private GameRooms: string;
	private playerObject1: any;
	private playerObject2: any;
	private playersObjects: any;
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

	movePaddle(socket: Socket, payload : any): void {
		// console.log('payload: ', payload);
		try{
			socket.on('Upkey', () => {
				if (payload.player1.id === this.playersObjects.playerId1){
					console.log('before : ', this.playersObjects.player1Pos);
					this.playersObjects.player1Pos += 30;
					socket.emit('playerMoved', this.playersObjects);
					console.log('after : ', this.playersObjects.player1Pos);
				}
			});
			// socket.on('Downkey', () => {
			// 	if (payload.id === payload.player1Id){
			// 		payload.player1Pos -= 30;
			// 		socket.emit('playerMoved', payload.player1Pos);
			// 	}
			// 	else if (payload.id === payload.player2Id){
			// 		payload.player2Pos -= 30;
			// 		socket.emit('playerMoved', payload.player2Pos);
			// 	}
			// 	else if (payload.id === payload.player1Id && payload.id === payload.player2Id){
			// 		payload.player1Pos -= 0;
			// 		socket.emit('playerMoved', payload.player1Pos, payload.player2Pos);
			// 	}
			// });
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