import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
} from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	cors: '*',
})

export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private connectedPlayers: any = [];
	private canvasWidth: number = 1080;
	private canvasHeight: number = 720;
	private room: string = '';
	private ball: any = {
		x: this.canvasWidth / 2,
		y: this.canvasHeight / 2,
		radius: 10,
		velocityX: 5,
		velocityY: 5,
		speed: 7,
	}

	private Player1: any = {
		id: '',
		x: 10,
		y: 500,
		width: 20,
		height: 150,
		color: 'white',
		score: 0,
		velY: 5,
	}

	private Player2: any = {
		id: '',
		x: this.canvasWidth - 30,
		y: 110,
		width: 20,
		height: 150,
		color: 'white',
		velY: 5,
		score: 0,
	}

	@WebSocketServer() server: Server;
	constructor(
		private readonly GameRoom: GameService,
	) {
		this.startInterval();
	}

	handleConnection(client: Socket, ...args: any[]) {
		if (this.connectedPlayers.length < 2) {
			const playerId = client.handshake.auth.token;
			if (!this.connectedPlayers.some(player => player.id === playerId)) {
				const player = {
					id: playerId,
					username: '',
					socket_id: client,
					y: 500,
					score: 0,
					isInGame: false,
				};
				this.connectedPlayers.push(player);
				if (this.connectedPlayers.length === 2) {
					this.room = this.GameRoom.createRoom();
					let playersData = {
						id1: this.connectedPlayers[0].id,
						id2: this.connectedPlayers[1].id,
						y1: this.connectedPlayers[0].y,
						y2: this.connectedPlayers[1].y,
						score1: this.connectedPlayers[0].score,
						score2: this.connectedPlayers[1].score,
						Socket1: this.connectedPlayers[0].socket_id,
						Socket2: this.connectedPlayers[1].socket_id,
						Room: this.room,
						gameStatus: false,
					};
					this.connectedPlayers[0].socket_id.join(this.room);
					this.connectedPlayers[1].socket_id.join(this.room);
					this.server.emit('players', {
						id: playersData.id1, id2: playersData.id2,
						y1: playersData.y1, y2: playersData.y2,
					});
					this.Player1.id = playersData.id1;
					this.Player2.id = playersData.id2;
					this.Player1.y = playersData.y1;
					this.Player2.y = playersData.y2;
				}
			} else {
				console.log(`Player with ID ${playerId} is already in the room.`);
			}
		} else {
			console.log("Room is full. Cannot accept more players.");
		}
	}

	@SubscribeMessage('playerMove')
	movePaddle(socket: Socket, payload: any): void {
		function lerp(start: number, end:number, t:number) {
			return start * (1 - t) + end * t;
		}
		const targetY = payload.key === 'ArrowUp' ? this.connectedPlayers[0].y - 90 : this.connectedPlayers[0].y + 90;
		this.connectedPlayers[0].y = lerp(this.connectedPlayers[0].y, targetY, 0.9);
		// this.Player1.y = lerp(this.Player1.y, targetY, 0.9);
	
		// Update Player2's y position as well
		// const targetY2 = payload.key === 'ArrowUp' ? this.connectedPlayers[1].y - 90 : this.connectedPlayers[1].y + 90;
		// this.connectedPlayers[1].y = lerp(this.connectedPlayers[1].y, targetY2, 0.9);
		// this.Player2.y = lerp(this.Player2.y, targetY2, 0.9);
	
		this.server.to(this.room).emit('UpdatePlayerMove', { y: this.connectedPlayers[0].y, y1:this.connectedPlayers[1].y, id: payload.id });
	}


	moveBall(): void {
		this.ball.x += this.ball.velocityX;
		this.ball.y += this.ball.velocityY;
		if (this.ball.y + this.ball.radius > this.canvasHeight || this.ball.y - this.ball.radius < 0)
			this.ball.velocityY = -this.ball.velocityY;
		const resetBall = () => {
			this.ball.x = this.canvasWidth / 2;
			this.ball.y = this.canvasHeight / 2;
			this.ball.speed = 7;
			this.ball.velocityY = -this.ball.velocityY * 1.0;
			this.ball.velocityX = -this.ball.velocityX * 1.0;
		};
		const player1 = this.Player1;
		const player2 = this.Player2;
		const ball = this.ball;
		const detectCollision = (player: any) => {
			player.top = player.y;
			player.right = player.x + player.width;
			player.bottom = player.y + player.height;
			player.left = player.x;
			return ball.top < player.bottom && ball.bottom > player.top && ball.left < player.right && ball.right > player.left;
		};
		if (detectCollision(player1)) {
			console.log('collision  1');
			this.ball.velocityX = -this.ball.velocityX;
			const collidePoint = (this.ball.y - (player1.y + player1.height / 2));
			this.ball.speed += 0.2;
			let direction = (collidePoint < 0) ? -1 : 1;
			this.ball.velocityY = direction * this.ball.speed * Math.cos(collidePoint * 0.35);
		}
		if (detectCollision(player2)) {
			console.log('collision  2');
			this.ball.velocityX = -this.ball.velocityX;
			const collidePoint = (this.ball.y - (player2.y + player2.height / 2));
			this.ball.speed += 0.2;
			let direction = (collidePoint < 0) ? -1 : 1;
			this.ball.velocityY = direction * this.ball.speed * Math.cos(collidePoint * 0.35);
		}
		if (this.ball.x - this.ball.radius < 0)
			resetBall();
		if (this.ball.x + this.ball.radius > this.canvasWidth)
			resetBall();
		this.server.to(this.room).emit('ball', { x: this.ball.x, y: this.ball.y });
	}

	startInterval() {
		setInterval(() => {
			this.moveBall();
		}, 10);
	}

	handleDisconnect(socket: Socket): void {
		try {
			this.connectedPlayers.forEach((player: any, index: number) => {
				if (player.socket_id === socket)
					this.connectedPlayers.splice(index, 1);
			});
		} catch (error) {
			console.error('Error handling disconnection:', error);
		}
	}
}

