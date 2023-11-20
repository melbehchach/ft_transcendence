// import { Injectable } from '@nestjs/common';
// import { GameService } from './game.service';
// import { Server, Socket } from 'socket.io';



// @Injectable()
// export class PlayerService {
// 	public ConnectedPlayers: playerQueue;
// 	public playerObject1: any;
// 	public playerObject2: any;
// 	public playersObjects: any;
// 	public canvasWidth: number = 1080;
// 	public canvasHeight: number = 720;
// 	public isWaiting: boolean = false;
// 	private ball: any = {
// 		x: this.canvasWidth / 2,
// 		y: this.canvasHeight / 2,
// 		radius: 10,
// 		velocityX: 5,
// 		velocityY: 5,
// 		speed: 7,
// 	}
// 	constructor(private GameRoom: GameService) { }
// 	handleJoinsGame(socket: Socket, io: Server): void {
// 		// if (!this.ConnectedPlayers)
// 		// 	this.ConnectedPlayers = new playerQueue();
// 		// if (!this.playerObject1) {
// 		// 	this.playerObject1 = {
// 		// 		player1Id: socket.handshake.auth.token,
// 		// 		username1: '',
// 		// 		socket1Id: socket.id,
// 		// 		PosPlayer1: 500,
// 		// 		score1Player: 0,
// 		// 		isInGame: false,
// 		// 	};
// 		// }
// 		// else if (!this.playerObject2) {
// 		// 	this.playerObject2 = {
// 		// 		player2Id: socket.handshake.auth.token,
// 		// 		username2: '',
// 		// 		socket2Id: socket.id,
// 		// 		PosPlayer2: 500,
// 		// 		score2Player: 0,
// 		// 		isInGame: false,
// 		// 	};
// 		// }
// 		// if (this.playerObject1 && this.playerObject2) {
// 		// 	let room = this.GameRoom.createRoom();
// 		// 	this.playersObjects = {
// 		// 		playerId1: this.playerObject1.player1Id,
// 		// 		playerId2: this.playerObject2.player2Id,
// 		// 		player1Pos: this.playerObject1.PosPlayer1,
// 		// 		player2Pos: this.playerObject2.PosPlayer2,
// 		// 		player1score: this.playerObject1.score1Player,
// 		// 		player2score: this.playerObject2.score2Player,
// 		// 		Room: room,
// 		// 		gameStatus: false,
// 		// 	};
// 		// 	this.ConnectedPlayers.addToQueue(this.playersObjects);
// 		// 	if (this.ConnectedPlayers && this.ConnectedPlayers.connectedPlayers[0]) {
// 		// 		socket.join(this.ConnectedPlayers.connectedPlayers[0].Room);
// 		// 		socket.emit('playerReady', this.playersObjects);
// 		// 		// console.log('this.ConnectedPlayers: ', this.ConnectedPlayers.connectedPlayers);
// 		// 	}
// 		// };
// 	}

	// movePaddle(socket: Socket, payload: any, io: Server): void {
	// 	try {
	// 		if (payload.key === 'ArrowUp') {
	// 			if (this.playersObjects && this.playersObjects.player1Pos)
	// 				this.playersObjects.player1Pos -= 90;
	// 			else
	// 				console.log('hhhhhhhh')
	// 			io.to(this.ConnectedPlayers.connectedPlayers[0].Room).emit('Up', { key: 'ArrowUp', player1Pos: this.playersObjects.player1Pos, id: payload.id })
	// 		}
	// 		else if (payload.key === 'ArrowDown') {
	// 			if (this.playersObjects && this.playersObjects.player1Pos)
	// 				this.playersObjects.player1Pos += 90;
	// 			io.to(this.ConnectedPlayers.connectedPlayers[0].Room).emit('Up', { key: 'ArrowDown', player1Pos: this.playersObjects.player1Pos, id: payload.id })
	// 		}
	// 	}
	// 	catch (error) {
	// 		console.error('Error handling paddle mouvement:', error);
	// 	}
	// }

	// moveBall(socket: Socket, io: Server) {
		// this.ball.x += this.ball.velocityX;
		// this.ball.y += this.ball.velocityY;
		// if (this.ball.y + this.ball.radius > this.canvasHeight || this.ball.y - this.ball.radius < 0) {
		// 	this.ball.velocityY = -this.ball.velocityY;
		// }
		// const detectedCollision = (player: any | null) => {
		// 	if (!player) {
		// 		return false;
		// 	}
		// 	const playerTop = player.y;
		// 	const playerBottom = player.y + player.height;
		// 	const playerLeft = player.x;
		// 	const playerRight = player.x + player.width;

		// 	const ballTop = this.ball.y - this.ball.radius;
		// 	const ballBottom = this.ball.y + this.ball.radius;
		// 	const ballLeft = this.ball.x - this.ball.radius;
		// 	const ballRight = this.ball.x + this.ball.radius;

		// 	return playerLeft < ballRight && playerTop < ballBottom && playerRight > ballLeft && playerBottom > ballTop;
		// };

		// let detectedPlayer = (this.ball.x + this.ball.radius < this.canvasWidth / 2) ? this.playerObject1 : this.playerObject2;
		// if (detectedCollision(detectedPlayer)) {
		// 	let collidePoint = this.ball.y - (detectedPlayer.y + detectedPlayer.height / 2);
		// 	collidePoint = collidePoint / (detectedPlayer.height / 2);
		// 	let angleRad = collidePoint * Math.PI / 4;
		// 	let direction = (this.ball.x + this.ball.radius < this.canvasWidth / 2) ? 1 : -1;
		// 	this.ball.speed * Math.sin(angleRad);
		// 	this.ball.speed += 0.9;
		// }
		// if (this.ConnectedPlayers && this.ConnectedPlayers.connectedPlayers[0]) {
		// 	io.to(this.playersObjects.Room).emit('ball', { ball: this.ball });
		// }
		// // setInterval(this.moveBall.bind(this), 20);
	// }

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
