import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChannelType } from '@prisma/client';
import { newChannelDto, updateChannelDto } from 'src/dto/channels.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChannelsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserChannels(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          ChannelsOwner: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          ChannelsAdmin: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          ChannelsMember: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });
      const channels = [
        ...user.ChannelsOwner,
        ...user.ChannelsAdmin,
        ...user.ChannelsMember,
      ];
      return channels;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error occured while retrieving record',
      );
    }
  }

  async getChannelById(channelId: string, userId: string) {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
      include: {
        admins: {
          where: {
            id: userId,
          },
        },
        Members: {
          where: {
            id: userId,
          },
        },
      },
    });
    if (!channel) {
      throw new InternalServerErrorException('Channel Not Found');
    }
    if (
      channel?.admins.length === 0 &&
      channel?.Members.length === 0 &&
      channel?.ownerId !== userId
    ) {
      throw new UnauthorizedException('Forbidden');
    }
    delete channel.password;
    return channel;
  }

  async createChannel(data: newChannelDto, userId: string) {
    if (data.type === ChannelType.PROTECTED && data.password.length === 0) {
      throw new BadRequestException(
        'Password is required for Protected Channels',
      );
    }
    try {
      const newChannel = await this.prisma.channel.create({
        data: {
          name: data.name,
          //   image: data.image.path,
          image: data.image,
          type: data.type,
          password: data.type === ChannelType.PROTECTED ? data.password : null,
          owner: {
            connect: {
              id: userId,
            },
          },
        },
      });
      delete newChannel?.password;
      return newChannel;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error occured while creating record',
      );
    }
  }

  async updateChannel(
    userId: string,
    channelId: string,
    data: updateChannelDto,
  ) {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
      include: {
        admins: {
          where: {
            id: userId,
          },
        },
      },
    });
    if (!channel)
      throw new InternalServerErrorException('This channel does not exist');
    if (channel.admins.length === 0 && channel.ownerId !== userId) {
      throw new UnauthorizedException('Forbidden');
    }
    if (data.type === ChannelType.PROTECTED && data.password.length === 0) {
      throw new BadRequestException(
        'Password is required for Protected Channels',
      );
    }
    try {
      const updatedChannel = await this.prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          name: data.name.length > 0 ? data.name : channel.name,
          image: data.image.length > 0 ? data.image : channel.image,
          type: data.type ? data.type : channel.type,
          password: data.type === ChannelType.PROTECTED ? data.password : null,
        },
      });
      delete updatedChannel?.password;
      return updatedChannel;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error occured while updating record',
      );
    }
  }

  async deleteChannel(channelId: string, userId: string) {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
      },
      select: {
        ownerId: true,
      },
    });
    if (!channel) {
      throw new InternalServerErrorException('Channel Not Found');
    }
    if (channel.ownerId !== userId) {
      throw new UnauthorizedException('Forbidden');
    }
    try {
      const deletedChannel = await this.prisma.channel.delete({
        where: {
          id: channelId,
        },
        select: {
          id: true,
          name: true,
          type: true,
        },
      });
      return deletedChannel;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error occured while deleting record',
      );
    }
  }
}
