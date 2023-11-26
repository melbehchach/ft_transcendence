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
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway({
	cors: '*',
	namespace: 'game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	canvasWidth = 1080;
	canvasHeight = 720;
	gameQueue: any[] = []; // queue of players waiting for a game
	mapPlayers: Map<string, any> = new Map(); // map of players in a game
	mapSocketToPlayer: Map<string, Socket> = new Map(); // map of connected players with their socket
	MapRoomToPlayers: Map<string, any> = new Map(); // map of players in a game with their room
	private MapGames = new Map<string, any>(); // map of games
	@WebSocketServer() server: Server;
	constructor(
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
				const room = uuidv4();
				opponent.x = this.canvasWidth - 30;
				await this.prisma.game.create({
					data: {
						id: room,
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
				player.socket.join(room);
				opponent.socket.join(room);
				this.mapPlayers.set(player.id, player);
				this.mapPlayers.set(opponent.id, opponent);
				this.MapRoomToPlayers.set(room, [player, opponent]);
				const gameState = {
					roomName: room,
					player1_id: player.id,
					player2_id: opponent.id,
					player1_score: player.score,
					player2_score: opponent.score,
					player1_y: player.y,
					player2_y: opponent.y,
					ball: {
						x: this.canvasWidth / 2,
						y: this.canvasHeight / 2,
						radius: 10,
						velocityX: 2,
						velocityY: 2,
						speed: 0.3,
					},
				};
				this.MapGames.set(room, gameState);
				const gameRoom = this.MapGames.get(room);
				console.log('gameRoom', gameRoom);
				this.server.to(gameRoom.roomName).emit('RandomMatch', {
					player: gameRoom.player1_id, opponent: gameRoom.player2_id,
					playerY: gameRoom.player1_y, opponentY: gameRoom.player2_y,
					room: gameRoom.roomName, playerScore: gameRoom.player1_score, opponentScore: gameRoom.player2_score,
				});
			}
		}
		catch (error) {
			console.log(error);
		}
	}



	@SubscribeMessage('move')
	movePaddle(client: Socket, payload: any): void {
		if (this.mapPlayers.has(payload.player)) {
			const player = this.mapPlayers.get(payload.player);
			if (payload.direction === 'up')
				player.y -= 50;
			else if (payload.direction === 'down')
				player.y += 50;
			if (player.y < 0)
				player.y = 0;
			else if (player.y > this.canvasHeight - player.height)
				player.y = this.canvasHeight - player.height;
			let room: string = '';
			for (const [key, value] of this.MapRoomToPlayers.entries()) {
				if (value.some(player => player.id === payload.player)) {
					room = key;
					break;
				}
			}
			const gameRoom = this.MapGames.get(room);
			gameRoom.player1_id = player.id;
			gameRoom.player1_y = player.y;
			this.MapGames.set(room, gameRoom);
			this.server.to(room).emit('PlayerMoved', { player: gameRoom.player1_id, y: gameRoom.player1_y });
		}
	}

	private handleCollision(playerdetected: any, ball: any) {

		let collidePoint = (ball.y - (playerdetected.y + playerdetected.height / 2));
		collidePoint = collidePoint / (playerdetected.height / 2);
		let angleRad = (Math.PI / 4) * collidePoint;
		let direction = (ball.x < this.canvasWidth / 2) ? 1 : -1; // Change direction based on ball's position
		ball.velocityX = direction * ball.speed * Math.cos(angleRad);
		ball.velocityY = ball.speed * Math.sin(angleRad);
		ball.speed += 0.2;
	}

	private collision = (ball: any, player: any) => {
		if (ball && player) {
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
		return false;
	};

	moveBall(socket: Socket): void {
		let player1, player2, roomName;
		if (!this.MapRoomToPlayers.has(roomName)) return;
		player1 = this.MapRoomToPlayers.get(roomName)[0];
		if (this.MapRoomToPlayers.get(roomName)[1].id !== player1.id) {
			player2 = this.MapRoomToPlayers.get(roomName)[1];
		}
		for (const [key, value] of this.MapRoomToPlayers.entries()) {
			if (value.some(player => player.id === player1.id)) {
				roomName = key;
				break;
			}
		}
		const gameRoom = this.MapGames.get(roomName);
		gameRoom.ball.x += gameRoom.ball.velocityX;
		gameRoom.ball.y += gameRoom.ball.velocityY;

		if (this.collision(gameRoom.ball, player1)) {
			// console.log('collision', gameRoom.ball.x, gameRoom.ball.y, player1.id);
			this.handleCollision(player1, gameRoom.ball);
		}
		if (this.collision(gameRoom.ball, player2)) {
			// console.log('collision', gameRoom.ball.x, gameRoom.ball.y, player2.id);
			this.handleCollision(player2, gameRoom.ball);
		}

		if (gameRoom.ball.y + gameRoom.ball.radius > this.canvasHeight || gameRoom.ball.y - gameRoom.ball.radius < 0)
			gameRoom.ball.velocityY = -gameRoom.ball.velocityY;
		if (gameRoom.ball.x - gameRoom.ball.radius < 0) {
			// player2.score++;
			gameRoom.ball.x = this.canvasWidth / 2;
			gameRoom.ball.y = this.canvasHeight / 2;
			gameRoom.ball.speed = 0.3;
			gameRoom.ball.velocityX = -gameRoom.ball.velocityX;
			// this.server.to(roomName).emit('Score', { player: player2.id, score: player2.score });
		}
		else if (gameRoom.ball.x + gameRoom.ball.radius > this.canvasWidth) {
			// player1.score++;
			gameRoom.ball.x = this.canvasWidth / 2;
			gameRoom.ball.y = this.canvasHeight / 2;
			gameRoom.ball.speed = 0.3;
			gameRoom.ball.velocityX = -gameRoom.ball.velocityX;
			// this.server.to(roomName).emit('Score', { player: player1.id, score: player1.score });
		}
		this.server.to(roomName).emit('BallMoved', { x: gameRoom.ball.x, y: gameRoom.ball.y, player: gameRoom.player1_id, opponent: gameRoom.player2_id });
	}

	startInterval(socket: Socket) {
		setInterval(() => {
			this.moveBall(socket);
		}, 1000 / 60);
	}

	handleDisconnect(socket: Socket): void {
		const playerId: string = socket.handshake.auth.token;
		if (playerId) {
			this.mapSocketToPlayer.delete(playerId);
			this.gameQueue = this.gameQueue.filter(player => player.id !== playerId);
			this.mapPlayers.delete(playerId);

			let roomName;
			for (const [room, players] of this.MapRoomToPlayers.entries()) {
				if (players.some((p: any) => p.id === playerId)) {
					roomName = room;
					break;
				}
			}
			if (roomName) {
				this.MapRoomToPlayers.delete(roomName);
				this.MapGames.delete(roomName);
			}
			// console.log('Player disconnected: ', socket.id);
		}
	}

}