/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { BadRequestException } from '@nestjs/common';

@WebSocketGateway({
  cors: '*',
  namespace: 'game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  canvasWidth = 1080;
  canvasHeight = 720;
  gameQueue: any[] = []; // queue of players waiting for a game
  gameQueue2: any[] = []; // queue of invited players waiting for a game aka vip room
  mapPlayers: Map<string, any> = new Map(); // map of players in a game key is player id and value is player object
  mapSocketToPlayer: Map<string, Socket> = new Map(); // map of connected players with their socket
  MapRoomToPlayers: Map<string, any> = new Map(); // map of players in a game with their room
  private MapGames = new Map<string, any>(); // map of games
  private playerInterval: Map<string, any> = new Map(); // map of player interval
  @WebSocketServer() server: Server;
  constructor(
    private readonly prisma: PrismaService,
    private readonly gameService: GameService,
  ) {}

  handleConnection(client: Socket, ...args: any[]) {
    const playeId: string = client.handshake.auth.token;
    if (playeId) {
      this.mapSocketToPlayer.set(playeId, client);
      this.startInterval(client);
    }
  }

  private startCountDown(room: string) {
    this.server.to(room).emit('startCountDown');
  }

  private updateCountDown(room: string, count: number) {
    this.server.to(room).emit('updateCountDown', count);
  }

  @SubscribeMessage('InviteFriend')
  async createInviteMatch(socket: Socket, payload: any): Promise<void> {
    try {
      const playerId = socket.handshake.auth.token;
      const ObjectPlayer = {
        id: playerId,
        socket: this.mapSocketToPlayer.get(playerId),
        x: 10,
        y: this.canvasHeight / 2 - 75,
        score: 0,
        width: 20,
        velocityY: 0,
        height: 150,
      };
      if (!this.gameQueue2.some((player) => player.id === ObjectPlayer.id)) {
        this.gameQueue2.push(ObjectPlayer);
      }
      if (this.gameQueue2.length >= 2) {
        const player = this.gameQueue2.shift(); // player 1
        const opponent = this.gameQueue2.shift(); // player 2
        const room = payload.room;
        opponent.x = this.canvasWidth - 30;
        player.socket.join(room);
        opponent.socket.join(room);
        this.server.to(room).emit('gameStartInvite', {});
        this.mapPlayers.set(player.id, player);
        this.mapPlayers.set(opponent.id, opponent);
        this.MapRoomToPlayers.set(room, [player, opponent]);
        const gameState = {
          roomName: room,
          player1Obj: player,
          player2Obj: opponent,
          ball: {
            x: this.canvasWidth / 2,
            y: this.canvasHeight / 2,
            radius: 10,
            velocityX: 0.0005,
            velocityY: 0.0005,
            speed: 0.01,
          },
        };
        this.MapGames.set(room, gameState);
        try {
          await this.prisma.game.update({
            where: {
              id: room,
            },
            data: {
              Player: {
                connect: { id: player.id },
              },
              Opponent: {
                connect: { id: opponent.id },
              },
              playerScore: gameState.player1Obj.score,
              opponentScore: gameState.player2Obj.score,
              type: GameType.FriendMatch,
            },
          });
        } catch (error) {}
        const gameRoom = this.MapGames.get(room);
        this.server.to(gameRoom.roomName).emit('InviteFriend', {
          player: gameRoom.player1Obj.id,
          opponent: gameRoom.player2Obj.id,
          playerY: gameRoom.player1Obj.y,
          opponentY: gameRoom.player2Obj.y,
          room: gameRoom.roomName,
          playerScore: gameRoom.player1Obj.score,
          opponentScore: gameRoom.player2Obj.score,
        });
      }
    } catch (error) {}
  }

  @SubscribeMessage('RandomMatch')
  async createRandomMatch(socket: Socket, ...args: any[]): Promise<void> {
    try {
      let count = 3;
      const playeId: string = socket.handshake.auth.token;
      const ObjectPlayer = {
        id: playeId,
        socket: this.mapSocketToPlayer.get(playeId),
        x: 10,
        y: this.canvasHeight / 2 - 75,
        score: 0,
        width: 20,
        velocityY: 0,
        height: 150,
      };
      if (!this.gameQueue.some((player) => player.id === ObjectPlayer.id)) {
        this.gameQueue.push(ObjectPlayer);
      }
      if (this.gameQueue.length >= 2) {
        const player = this.gameQueue.shift(); // player 1
        const opponent = this.gameQueue.shift(); // player 2
        const room = uuidv4();
        opponent.x = this.canvasWidth - 30;
        this.startCountDown(room);
        const intervalId = setInterval(async () => {
          count--;
          this.updateCountDown(room, count);
          if (count === 0) {
            clearInterval(intervalId);
          }
        }, 1000);
        player.socket.join(room);
        opponent.socket.join(room);
        this.server.to(room).emit('gameStart', {});
        this.mapPlayers.set(player.id, player);
        this.mapPlayers.set(opponent.id, opponent);
        this.MapRoomToPlayers.set(room, [player, opponent]);
        const gameState = {
          roomName: room,
          player1Obj: player,
          player2Obj: opponent,
          ball: {
            x: this.canvasWidth / 2,
            y: this.canvasHeight / 2,
            radius: 10,
            velocityX: 1,
            velocityY: 1,
            speed: 2,
          },
        };
        this.MapGames.set(room, gameState);
        const playerDb = await this.prisma.user.findUnique({
          where: { id: player.id },
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        });
        const opponentDb = await this.prisma.user.findUnique({
          where: { id: opponent.id },
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        });
        if (playerDb && opponentDb) {
          try {
            await this.prisma.game.create({
              data: {
                id: room,
                Player: {
                  connect: { id: player.id },
                },
                Opponent: {
                  connect: { id: opponent.id },
                },
                playerScore: gameState.player1Obj.score,
                opponentScore: gameState.player2Obj.score,
                type: GameType.RandomMatch,
              },
            });
          } catch (error) {
            console.error(error);
          }
        }
        const gameRoom = this.MapGames.get(room);
        this.server.to(gameRoom.roomName).emit('RandomMatch', {
          player: gameRoom.player1Obj.id,
          opponent: gameRoom.player2Obj.id,
          playerY: gameRoom.player1Obj.y,
          opponentY: gameRoom.player2Obj.y,
          room: gameRoom.roomName,
          playerAvatr: playerDb?.avatar,
          opponentAvatar: opponentDb?.avatar,
        });
      }
    } catch (error) {
      throw new BadRequestException('something bad happend caused by ', error);
    }
  }

  @SubscribeMessage('move')
  movePaddle(client: Socket, payload: any): void {
    const gameRoom = this.MapGames.get(payload.room);
    if (!gameRoom) return;
    if (payload.player === gameRoom.player1Obj.id) {
      if (payload.direction === 'up') {
        gameRoom.player1Obj.y = Math.max(0, gameRoom.player1Obj.y - 50);
      } else if (payload.direction === 'down') {
        gameRoom.player1Obj.y = Math.min(
          this.canvasHeight - gameRoom.player1Obj.height,
          gameRoom.player1Obj.y + 50,
        );
      }
    } else if (payload.player === gameRoom.player2Obj.id) {
      if (payload.direction === 'up') {
        gameRoom.player2Obj.y = Math.max(0, gameRoom.player2Obj.y - 50);
      } else if (payload.direction === 'down') {
        gameRoom.player2Obj.y = Math.min(
          this.canvasHeight - gameRoom.player2Obj.height,
          gameRoom.player2Obj.y + 50,
        );
      }
    }
    this.MapGames.set(payload.room, gameRoom);
    this.server.to(payload.room).emit('PlayerMoved', {
      player: gameRoom.player1Obj.id,
      playerY: gameRoom.player1Obj.y,
      opponent: gameRoom.player2Obj.id,
      opponentY: gameRoom.player2Obj.y,
    });
  }

  private handleCollision(playerdetected: any, ball: any) {
    let collidePoint = ball.y - (playerdetected.y + playerdetected.height / 2);
    collidePoint = collidePoint / (playerdetected.height / 2);
    const angleRad = (Math.PI / 4) * collidePoint;
    const direction = ball.x < this.canvasWidth / 2 ? 1 : -1; // Change direction based on ball's position
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);
    ball.speed += 0.1;
  }

  private collision = (ball: any, player: any) => {
    player.top = player.y;
    player.right = player.x + player.width;
    player.bottom = player.y + player.height;
    player.left = player.x;

    ball.top = ball.y - ball.radius;
    ball.right = ball.x + ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
    return (
      ball.left < player.right &&
      ball.top < player.bottom &&
      ball.right > player.left &&
      ball.bottom > player.top
    );
  };

  private resetBall = (room: string) => {
    const gameRoom = this.MapGames.get(room);
    if (gameRoom) {
      gameRoom.ball.x = this.canvasWidth / 2;
      gameRoom.ball.y = this.canvasHeight / 2;
      gameRoom.ball.velocityX = -gameRoom.ball.velocityX;
    }
  };

  moveBall(socket: Socket): void {
    this.MapGames.forEach((room, currentGameRoom) => {
      const constSpeed = 2;
      const directionX = room.ball.velocityX > 0 ? 1 : -1;
      const directionY = room.ball.velocityY > 0 ? 1 : -1;
      room.ball.x += constSpeed * directionX;
      room.ball.y += constSpeed * directionY;

      if (this.collision(room.ball, room.player1Obj)) {
        this.handleCollision(room.player1Obj, room.ball);
      }
      if (this.collision(room.ball, room.player2Obj)) {
        this.handleCollision(room.player2Obj, room.ball);
      }

      if (
        room.ball.y + room.ball.radius > this.canvasHeight ||
        room.ball.y - room.ball.radius < 0
      )
        room.ball.velocityY = -room.ball.velocityY;
      if (room.ball.x - room.ball.radius < 0) {
        room.player2Obj.score++;
        this.resetBall(currentGameRoom);
      } else if (room.ball.x + room.ball.radius > this.canvasWidth) {
        room.player1Obj.score++;
        this.resetBall(currentGameRoom);
      }
      this.server.to(room.roomName).emit('updateScore', {
        player: room.player1Obj.id,
        playerScore: room.player1Obj.score,
        opponentScore: room.player2Obj.score,
        room: room.roomName,
      });
      this.server.to(room.roomName).emit('BallMoved', {
        x: room.ball.x,
        y: room.ball.y,
        player: room.player1Obj.id,
        opponent: room.player2Obj.id,
      });
    });
  }

  async GameOver(room: string): Promise<void> {
    const gameRoom = this.MapGames.get(room);
    if (gameRoom.player1Obj.score === 5 || gameRoom.player2Obj.score === 5) {
      await this.prisma.game.updateMany({
        where: {
          id: room,
        },
        data: {
          playerScore: gameRoom.player1Obj.score,
          opponentScore: gameRoom.player2Obj.score,
        },
      });
      const winnerId =
        gameRoom.player1Obj.score === 5
          ? gameRoom.player1Obj.id
          : gameRoom.player2Obj.id;
      this.server.to(room).emit('SubmiteScore', {
        winner: winnerId,
        loser:
          winnerId === gameRoom.player1Obj.id
            ? gameRoom.player2Obj.id
            : gameRoom.player1Obj.id,
        room: room,
      });
    }
  }

  @SubscribeMessage('GameIsOver')
  submiteScore(client: Socket, payload: any): void {
    const gameRoom = this.MapGames.get(payload.data.room);
    if (!gameRoom) return;
    this.server.to(payload.data.room).emit('CheckingWinner', {
      player: gameRoom.player1Obj.id,
      opponent: gameRoom.player2Obj.id,
      playerScore: gameRoom.player1Obj.score,
      opponentScore: gameRoom.player2Obj.score,
      room: gameRoom.roomName,
    });
    gameRoom.player1Obj.socket.leave(payload.data.room);
    gameRoom.player2Obj.socket.leave(payload.data.room);
  }

  startInterval(socket: Socket) {
    const playerId: string = socket.handshake.auth.token;
    if (this.playerInterval.has(playerId)) {
      clearInterval(this.playerInterval.get(playerId));
    }
    const intervalId = setInterval(() => {
      this.moveBall(socket);
      this.MapRoomToPlayers.forEach((players, room) => {
        this.GameOver(room);
      });
    }, 1000 / 60);
    this.playerInterval.set(playerId, intervalId);
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    const playerId: string = socket.handshake.auth.token;
    if (playerId) {
      this.mapSocketToPlayer.delete(playerId);
      this.gameQueue = this.gameQueue.filter(
        (player) => player.id !== playerId,
      );
      this.mapPlayers.delete(playerId);
      if (this.playerInterval.has(playerId)) {
        clearInterval(this.playerInterval.get(playerId));
        this.playerInterval.delete(playerId);
      }

      let roomName;
      for (const [room, players] of this.MapRoomToPlayers.entries()) {
        if (players.some((p: any) => p.id === playerId)) {
          roomName = room;
          break;
        }
      }
      if (roomName) {
        const gameRoom = this.MapGames.get(roomName);
        if (gameRoom) {
          if (gameRoom.player1Obj.id === playerId) {
            gameRoom.player2Obj.score = 5;
            await this.prisma.game.updateMany({
              where: {
                id: roomName,
              },
              data: {
                playerScore: gameRoom.player1Obj.score,
                opponentScore: gameRoom.player2Obj.score,
              },
            });
            this.resetBall(roomName);
            this.server
              .to(gameRoom.player2Obj.socket.id)
              .emit('UnexpectedWinner', {
                winner: gameRoom.player2Obj.id,
                score: gameRoom.player2Obj.score,
              });
          } else if (gameRoom.player2Obj.id === playerId) {
            gameRoom.player1Obj.score = 5;
            this.resetBall(roomName);
            await this.prisma.game.updateMany({
              where: {
                id: roomName,
              },
              data: {
                playerScore: gameRoom.player1Obj.score,
                opponentScore: gameRoom.player2Obj.score,
              },
            });
            this.server
              .to(gameRoom.player1Obj.socket.id)
              .emit('UnexpectedWinner', {
                winner: gameRoom.player1Obj.id,
                score: gameRoom.player1Obj.score,
              });
          }
          this.MapRoomToPlayers.delete(roomName);
          this.MapGames.delete(roomName);
        }
      }
    }
  }
}
