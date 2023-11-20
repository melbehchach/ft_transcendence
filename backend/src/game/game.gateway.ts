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

	private player1: any = {
		id: '',
		x: 10,
		y: this.canvasHeight / 2 - 100 / 2,
		width: 20,
		height: 150,
	};

	private player2: any = {
		id: '',
		x: this.canvasWidth - 30,
		y: this.canvasHeight / 2 - 100 / 2,
		width: 20,
		height: 150,
	};

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
			  let playersObjects = {
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
			  this.server.emit('players', {id: playersObjects.id1, id2: playersObjects.id2,
				y1: playersObjects.y1, y2: playersObjects.y2,
			});
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
		if (payload.key === 'ArrowUp'){
			this.connectedPlayers[0].y -= 90;
			this.server.to(this.room).emit('UpdatePlayerMove',
				{ y: this.connectedPlayers[0].y, id: payload.id })
		}else if (payload.key === 'ArrowDown'){
			this.connectedPlayers[0].y += 90;
			this.server.to(this.room).emit('UpdatePlayerMove',
				{ y: this.connectedPlayers[0].y, id: payload.id })
		}
	}

	moveBall(): void {
		this.ball.x += this.ball.velocityX;
		this.ball.y += this.ball.velocityY;
		if (this.ball.y + this.ball.radius > this.canvasHeight || this.ball.y - this.ball.radius < 0)
		  this.ball.velocityY = -this.ball.velocityY;
		const detectedCollision = (player: any, ball: any) => {
		  if (!player) return false;
		  const playerTop = this.connectedPlayers[0].y;
		  const playerBottom = player.y + player.height;
		  const playerLeft = player.x;
		  const playerRight = player.x + player.width;
  
		  const ballTop = ball.y - ball.radius;
		  const ballBottom = ball.y + ball.radius;
		  const ballLeft = ball.x - ball.radius;
		  const ballRight = ball.x + ball.radius;
  
		  return playerLeft < ballRight && playerTop < ballBottom && playerRight > ballLeft && playerBottom > ballTop;
		};

		const resetBall = () => {
			this.ball.x = this.canvasWidth / 2;
			this.ball.y = this.canvasHeight / 2;
			this.ball.speed = 7;
			this.ball.velocityX = -this.ball.velocityX;
		};

		const detectedPlayer = (this.ball.x + this.ball.radius < this.canvasWidth / 2) ?  this.player1 : this.player2;
		
		if (detectedCollision(detectedPlayer, this.ball)) {
		  let collidePoint = this.ball.y - (detectedPlayer.y + detectedPlayer.height / 2);
		  collidePoint = collidePoint / (detectedPlayer.height / 2);
		  let angleRad = collidePoint * Math.PI / 4;
		  let direction = (this.ball.x + this.ball.radius < this.canvasWidth / 2) ? 1 : -1;
		  this.ball.velocityX = this.ball.speed * Math.cos(angleRad) * direction;
		  this.ball.velocityY = this.ball.speed * Math.sin(angleRad);
		  this.ball.speed += 0.9;
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
				if (player.socket_id === socket) {
					this.connectedPlayers.splice(index, 1);
				}
				// console.log('Player disconnected:', player.id);
			});
		} catch (error) {
			console.error('Error handling disconnection:', error);
		}
	}
}

