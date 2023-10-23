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
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChannelsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly channelsService: ChannelsService) {}
  private logger = new Logger(ChannelsGateway.name);
  @WebSocketServer() server: Server;

  afterInit() {
    this.logger.log(`SERVER STARTED`);
  }

  handleConnection(client: any) {
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
