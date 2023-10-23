import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChannelsService } from './channels.service';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { validateToken } from 'src/helpers/auth.helpers';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChannelsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly channelsService: ChannelsService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}
  private logger = new Logger(ChannelsGateway.name);
  @WebSocketServer() server: Server;

  // only authenticated users should be able to connect and listen for events
  async afterInit(client: Socket) {
    this.logger.log(`SERVER STARTED`);
    client.use(async (req: any, next) => {
      try {
        const token = req.handshake.headers.jwt_token;
        console.log(token);
        const payload = await validateToken(token, this.jwtService);
        await this.authService.findUser(payload.email);
        next();
      } catch (error) {
        next(error);
      }
    });
  }

  async handleConnection(client: any) {
    const { sockets } = this.server.sockets;
    this.logger.log(
      `Client id: ${client.id} is now connected! ${sockets.size} Connected Clients`,
    );
  }

  handleDisconnect(client: any) {
    const { sockets } = this.server.sockets;
    this.logger.log(
      `${client.id} disconnected | ${sockets.size} Connected Clients`,
    );
  }

  @SubscribeMessage('message')
  sendMessage(@MessageBody() data) {
    this.logger.log(`message: payload [${data}]`);
    return 'Well Received';
  }
}
