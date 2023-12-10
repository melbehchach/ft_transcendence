import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChannelType } from '@prisma/client';
import { editTypeDto, makeAdminDto, newChannelDto } from 'src/dto/channels.dto';
// import { updateChannelDto } from 'src/dto/channels.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelsGateway } from './channels.gateway';

@Injectable()
export class ChannelsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: ChannelsGateway,
  ) {}

  // Get the channels that the user created or joined
  async getUserChannels(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          ChannelsMember: {
            select: {
              id: true,
              name: true,
              image: true,
              owner: {
                select: {
                  username: true,
                },
              },
              Members: {
                select: {
                  username: true,
                },
              },
            },
          },
        },
      });
      return user.ChannelsMember;
    } catch (error) {
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
        owner: {
          select: {
            username: true,
          },
        },
        admins: {
          select: {
            id: true,
            username: true,
          },
        },
        Members: {
          select: {
            id: true,
            username: true,
          },
        },
        Messages: {
          select: {
            id: true,
            senderId: true,
            body: true,
          },
        },
      },
    });
    if (!channel) {
      throw new InternalServerErrorException('Channel Not Found');
    }
    const members = channel?.Members.map((member) => {
      return member.id;
    });
    if (members.indexOf(userId) === -1) {
      throw new UnauthorizedException('Forbidden');
    }
    delete channel?.password;
    return channel;
  }

  async createChannel(data: newChannelDto, userId: string) {
    try {
      if (data.type === ChannelType.PROTECTED && data.password?.length === 0) {
        throw new Error('Password is required for Protected Channels');
      }
      data.Members = data.Members.concat(userId).filter((memberId: string) => {
        return memberId.length > 0;
      });
      await Promise.all(
        data.Members.map(async (id) => {
          const user = await this.prisma.user.findUnique({
            where: { id },
          });
          if (!user) {
            throw new Error('Invalid User in members list');
          }
          return user;
        }),
      );
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
          Members: {
            connect: data.Members?.map((memberId: string) => ({
              id: memberId,
            })),
          },
        },
        include: {
          Members: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });
      delete newChannel?.password;
      return newChannel;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // async updateChannel(
  //   userId: string,
  //   channelId: string,
  //   data: updateChannelDto,
  // ) {
  //   const channel = await this.prisma.channel.findUnique({
  //     where: {
  //       id: channelId,
  //     },
  //     include: {
  //       admins: {
  //         where: {
  //           id: userId,
  //         },
  //       },
  //       Members: true,
  //     },
  //   });
  //   if (!channel)
  //     throw new InternalServerErrorException('This channel does not exist');
  //   if (channel.admins.length === 0 && channel.ownerId !== userId) {
  //     throw new UnauthorizedException('Forbidden');
  //   }
  //   if (data.type === ChannelType.PROTECTED && data.password.length === 0) {
  //     throw new BadRequestException(
  //       'Password is required for Protected Channels',
  //     );
  //   }
  //   try {
  //     const updatedChannel = await this.prisma.channel.update({
  //       where: {
  //         id: channelId,
  //       },
  //       data: {
  //         name: data.name.length > 0 ? data.name : channel.name,
  //         image: data.image.length > 0 ? data.image : channel.image,
  //         type: data.type ? data.type : channel.type,
  //         password: data.type === ChannelType.PROTECTED ? data.password : null,
  //         Members: {
  //           connect: data.Members?.map((memberId: any) => ({
  //             id: memberId,
  //           })),
  //         },
  //       },
  //     });
  //     delete updatedChannel?.password;
  //     return updatedChannel;
  //   } catch (error) {
  //     console.log(error);
  //     throw new InternalServerErrorException(
  //       'Error occured while updating record',
  //     );
  //   }
  // }

  async validateChannelUpdate(userId: string, channelId: string) {
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
          select: {
            id: true,
          },
        },
      },
    });
    if (!channel)
      throw new InternalServerErrorException('This channel does not exist');
    if (channel.admins.length === 0 && channel.ownerId !== userId) {
      throw new UnauthorizedException('Forbidden');
    }
    delete channel.password;
    return channel;
  }

  async makeAdmin(userId: string, channelId: string, body: makeAdminDto) {
    try {
      const channel = await this.validateChannelUpdate(userId, channelId);
      const user = await this.prisma.user.findUnique({
        where: { id: body.id },
      });
      if (
        !user ||
        channel?.Members.map((member) => member.id).indexOf(body.id) == -1
      ) {
        throw new Error('Not a Member');
      }
      const updatedChannel = await this.prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          admins: {
            [body.makeAdmin ? 'connect' : 'disconnect']: {
              id: body.id,
            },
          },
        },
      });
      if (!updatedChannel) {
        throw new Error('Failed to update record');
      }
      return 'success';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async editChannelName(
    userId: string,
    channelId: string,
    body: { name: string },
  ) {
    try {
      if (!body.name || body.name.length === 0) {
        throw new Error('BadRequest');
      }
      await this.validateChannelUpdate(userId, channelId);
      const updatedChannel = await this.prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          name: body.name,
        },
      });
      if (!updatedChannel) {
        throw new Error('Failed to update record');
      }
      return 'success';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async editChannelAvatar(
    userId: string,
    channelId: string,
    // avatar: Express.Multer.File
    body: { avatar: string },
  ) {
    try {
      if (!body.avatar) {
        throw new Error('BadRequest');
      }
      await this.validateChannelUpdate(userId, channelId);
      const updatedChannel = await this.prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          image: body.avatar,
        },
      });
      if (!updatedChannel) {
        throw new Error('Failed to update record');
      }
      return 'success';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async editChannelType(userId: string, channelId: string, body: editTypeDto) {
    try {
      if (body.type === ChannelType.PROTECTED && body.password.length === 0) {
        throw new BadRequestException(
          'Password is required for Protected Channels',
        );
      }
      await this.validateChannelUpdate(userId, channelId);
      const updatedChannel = await this.prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          type: body.type,
          password: body.type === ChannelType.PROTECTED ? body.password : null,
        },
      });
      if (!updatedChannel) {
        throw new Error('Failed to update record');
      }
      return 'success';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // only fire a request from the client if the channel members change
  async editChannelMembers(
    userId: string,
    channelId: string,
    body: { members: string[] },
  ) {
    try {
      await this.validateChannelUpdate(userId, channelId);
      if (!body.members || body.members?.length === 0) {
        throw new Error('Invalid members list');
      }
      // make sure ownser is not added to the members array in the frontend
      body.members = body.members.concat(userId).filter((memberId: string) => {
        return memberId.length > 0;
      });
      await Promise.all(
        body.members.map(async (id) => {
          const user = await this.prisma.user.findUnique({
            where: { id },
          });
          if (!user) {
            throw new Error('Invalid User in members list');
          }
          return user;
        }),
      );
      const updatedChannel = await this.prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          Members: {
            connect: body.members?.map((memberId: string) => ({
              id: memberId,
            })),
          },
        },
      });
      if (!updatedChannel) {
        throw new Error('Failed to update record');
      }
      return 'success';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
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
      throw new InternalServerErrorException(
        'Error occured while deleting record',
      );
    }
  }
}
