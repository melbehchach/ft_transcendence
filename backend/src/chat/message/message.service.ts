import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { messageDto } from 'src/dto/message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelsGateway } from '../channels/channels.gateway';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: ChannelsGateway,
  ) {}

  async newMessage(data: messageDto, userId: string) {
    if (userId === data.receiverId) {
      throw new BadRequestException();
    }
    const receiver = await this.prisma.user.findUnique({
      where: { id: data.receiverId },
    });
    if (receiver) {
      throw new BadRequestException('Record Does Not Exist');
    }
    try {
      const message = await this.prisma.message.create({
        data: {
          body: data.body,
          sender: {
            connect: {
              id: userId,
            },
          },
          receiver: {
            connect: {
              id: data.receiverId,
            },
          },
        },
      });
      return message;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error occured while creating record',
      );
    }
  }

  //   async getMessageById(id: number) {
  //     try {
  //       const message = await this.prisma.message.findUnique({
  //         where: {
  //           id,
  //         },
  //       });
  //       return message;
  //     } catch (error) {
  //       console.log(error);
  //       throw new InternalServerErrorException(
  //         'Error occured while retreiving record',
  //       );
  //     }
  //   }
}
