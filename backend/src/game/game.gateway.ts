import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
} from '@nestjs/websockets';
import { PrismaService } from '../prisma/prisma.service';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
import { GameType } from '@prisma/client';
import * as _ from "lodash";

@WebSocketGateway({
	cors: '*',
	namespace: 'game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	canvasWidth = 1080;
	canvasHeight = 720;
	ball = {
		x: this.canvasWidth / 2,
		y: this.canvasHeight / 2,
		radius: 10,
		velocityX: 2,
		velocityY: 2,
		speed: 0.3,
	}
	gameQueue: any[] = [];
	mapPlayers: Map<string, any> = new Map();
	mapSocketToPlayer: Map<string, Socket> = new Map();
	roomName: string;
	@WebSocketServer() server: Server;
	constructor(
		private readonly GameRoom: GameService,
		private readonly prisma: PrismaService,
	) { }

	handleConnection(client: Socket, ...args: any[]) {
		const playeId: string = client.handshake.auth.token;
		if (playeId) {
			this.mapSocketToPlayer.set(playeId, client);
			this.startInterval(client);
		}
		// console.log('Player connected: ', client.id);
	}

	@SubscribeMessage('RandomMatch')
	async createRandomMatch(socket: Socket, ...args: any[]): Promise<void> {
		try {
			const playeId: string = socket.handshake.auth.token;
			const ObjectPlayer = {
				id: playeId,
				socket: this.mapSocketToPlayer.get(playeId),
				x: 10,
				y: this.canvasHeight / 2 - 75,
				score: 0,
				width: 20,
				height: 150,
			};
			if (!this.gameQueue.some(player => player.id === ObjectPlayer.id)) {
				this.gameQueue.push(ObjectPlayer);
			}
			if (this.gameQueue.length >= 2) {
				const player = this.gameQueue.shift(); // player 1
				const opponent = this.gameQueue.shift(); // player 2
				opponent.x = this.canvasWidth - 30;
				this.roomName = this.GameRoom.createRoom();
				await this.prisma.game.create({
					data: {
						id: this.roomName,
						Player: {
							connect: { id: player.id },
						},
						Opponent: {
							connect: { id: opponent.id },
						},
						playerScore: player.score,
						opponentScore: opponent.score,
						type: GameType.RandomMatch,
					},
				});
				player.socket.join(this.roomName);
				opponent.socket.join(this.roomName);
				this.mapPlayers.set(player.id, player);
				this.mapPlayers.set(opponent.id, opponent);
				this.server.to(this.roomName).emit('RandomMatch', {
					player: player.id, opponent: opponent.id,
					playerY: player.y, opponentY: opponent.y,
					room: this.roomName, playerScore: player.score, opponentScore: opponent.score,
				});
			}
		}
		catch (error) {
			console.log(error);
		}
	}

	@SubscribeMessage('move')
	movePaddle(client: Socket, payload: any): void {
		// console.log('move', payload);
		if (this.mapPlayers.has(payload.player)) {
			const player = this.mapPlayers.get(payload.player);
			if (payload.direction === 'up') {
				player.y -= 50;
			}
			else if (payload.direction === 'down') {
				player.y += 50;
			}
			if (player.y < 0) {
				player.y = 0;
			}
			else if (player.y > this.canvasHeight - player.height) {
				player.y = this.canvasHeight - player.height;
			}
			this.server.to(payload.room).emit('PlayerMoved', { player: player.id, y: player.y });
		}
	}

	private handleCollision(playerdetected: any) {
		let collidePoint = (this.ball.y - (playerdetected.y + playerdetected.height / 2));
		collidePoint = collidePoint / (playerdetected.height / 2);
		let angleRad = (Math.PI / 4) * collidePoint;
		let direction = (this.ball.x < this.canvasWidth / 2) ? 1 : -1; // Change direction based on ball's position
		this.ball.velocityX = direction * this.ball.speed * Math.cos(angleRad);
		this.ball.velocityY = this.ball.speed * Math.sin(angleRad);
		// this.ball.speed += 0.2;
	}

	moveBall(socket: Socket): void {
		let playerId = socket.handshake.auth.token;
		const [firstKey, secondKey] = this.mapPlayers.keys();
		let player1, player2;
		if (firstKey === playerId) {
			player1 = this.mapPlayers.get(firstKey);
			player2 = this.mapPlayers.get(secondKey);
		} else if (secondKey === playerId) {
			player1 = this.mapPlayers.get(firstKey);
			player2 = this.mapPlayers.get(secondKey);
		}

		this.ball.x += this.ball.velocityX;
		this.ball.y += this.ball.velocityY;
		const collision = (ball: any, player: any) => {
			player.top = player.y;
			player.right = player.x + player.width;
			player.bottom = player.y + player.height;
			player.left = player.x;
			ball.top = ball.y - ball.radius;
			ball.right = ball.x + ball.radius;
			ball.bottom = ball.y + ball.radius;
			ball.left = ball.x - ball.radius;
			return ball.left < player.right && ball.top < player.bottom && ball.right > player.left && ball.bottom > player.top;
		}
		// console.log('collision 1 ==> ', player1.id);
		// console.log('collision 2 ==> ', player2.id);
		if (collision(this.ball, player1)) {
			// console.log('collision 1 ==> ', player1.id);
			// console.log('collision 2 ==> ', player2.id);
			this.handleCollision(player1);
		}
		if (collision(this.ball, player2)) {
			// console.log('collision 2 ', player2.id);
			this.handleCollision(player2);
		}
		if (this.ball.y + this.ball.radius > this.canvasHeight || this.ball.y - this.ball.radius < 0)
			this.ball.velocityY = -this.ball.velocityY;
		if (this.ball.x - this.ball.radius < 0) {
			player2.score++;
			this.ball.x = this.canvasWidth / 2;
			this.ball.y = this.canvasHeight / 2;
			this.ball.speed = 0.3;
			this.ball.velocityX = -this.ball.velocityX;
			this.server.to(this.roomName).emit('Score', { player: player2.id, score: player2.score });
		}
		else if (this.ball.x + this.ball.radius > this.canvasWidth) {
			player1.score++;
			this.ball.x = this.canvasWidth / 2;
			this.ball.y = this.canvasHeight / 2;
			this.ball.speed = 0.3;
			this.ball.velocityX = -this.ball.velocityX;
			this.server.to(this.roomName).emit('Score', { player: player1.id, score: player1.score });
		}
		// console.log('ball", ', this.roomName);
		this.server.to(this.roomName).emit('BallMoved', { x: this.ball.x, y: this.ball.y, player: player1.id, opponent: player2.id });
	}

	startInterval(socket: Socket) {
		setInterval(() => {
			if (this.mapPlayers.size < 2) return;
			this.moveBall(socket);
		}, 1000 / 60);
	}

	handleDisconnect(socket: Socket): void {
		const playeId: string = socket.handshake.auth.token;
		if (playeId) {
			this.mapSocketToPlayer.delete(playeId);
			this.gameQueue = this.gameQueue.filter(player => player.id !== playeId);

			// console.log('Player disconnected: ', socket.id);
		}
	}

}