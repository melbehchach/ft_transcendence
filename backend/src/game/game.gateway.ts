import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
} from '@nestjs/websockets';
import { PlayerService } from './player.service';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { subscribe } from 'diagnostics_channel';
// import { JwtService } from '@nestjs/jwt';
// import { AuthService } from 'src/auth/auth.service';
// import { validateToken } from 'src/helpers/auth.helpers';

@WebSocketGateway({
  cors: '*',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly playerService: PlayerService,
    // private readonly jwtService: JwtService,
    // private readonly authService: AuthService,
  ) {}
  private logger = new Logger(GameGateway.name);
  private token: string;

  handleConnection(client: Socket): void {
    this.playerService.handleConnections(client);
  }

@SubscribeMessage('playerMoveUp')
movePaddle(socket : Socket, payload : any): void {
  this.playerService.movePaddle(socket, payload, this.server);
}

@SubscribeMessage('BallMove')
moveBall(socket : Socket, payload : any): void {
  this.playerService.moveBall(socket, payload, this.server);
}


  // async afterInit(client: Socket) {
  //   this.logger.log(`SERVER STARTED`);
  //   client.use(async (req: any, next) => {
  //     try {
  //       this.token = req.handshake.auth.token;
  //       const payload = await validateToken(this.token, this.jwtService);
  //       await this.authService.findUser(payload.email);
  //       next();
  //     } catch (error) {
  //       next(error);
  //     }
  //   });
  // }

  handleDisconnect(client: Socket): void {
    this.playerService.handleDisconnections(client);
  }
}
