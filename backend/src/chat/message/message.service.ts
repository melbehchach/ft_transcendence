import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { messageDto } from 'src/dto/message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async newMessage(data: messageDto, userId: string) {
    if (userId === data.receiverId) throw new BadRequestException();
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
