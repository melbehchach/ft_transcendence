import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChannelType, NotificationType } from '@prisma/client';
import { editTypeDto, makeAdminDto, newChannelDto } from 'src/dto/channels.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelsGateway } from './channels.gateway';
import * as argon from 'argon2';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class ChannelsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: ChannelsGateway,
    private readonly notifications: NotificationsService,
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
              type: true,
              owner: {
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
              mutedMembers: {
                select: {
                  userId: true,
                  time: true,
                },
              },
              Messages: true,
            },
          },
        },
      });
      return user.ChannelsMember;
    } catch (error) {
      throw new BadRequestException('Error occured while retrieving record');
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
        bannedMembers: {
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
        mutedMembers: {
          select: {
            userId: true,
            time: true,
          },
        },
      },
    });
    if (!channel) {
      throw new BadRequestException('Channel Not Found');
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

  async exploreChannels(userId: string) {
    try {
      const channels = await this.prisma.channel.findMany({
        where: {
          type: {
            in: [ChannelType.PROTECTED, ChannelType.PUBLIC],
          },
        },
        select: {
          id: true,
          name: true,
          image: true,
          type: true,
          Members: {
            select: {
              id: true,
              username: true,
            },
          },
          bannedMembers: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });
      if (!channels) {
        throw new Error('Failed to retrieve recrods');
      }
      const validChannels = channels.filter((channel) => {
        return (
          channel.Members.map((membr) => membr.id).indexOf(userId) === -1 &&
          channel.bannedMembers.map((membr) => membr.id).indexOf(userId) === -1
        );
      });
      return validChannels;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createChannel(data: newChannelDto, userId: string) {
    try {
      if (data.type === ChannelType.PROTECTED) {
        if (data.password?.length === 0) {
          throw new Error('Password is required for Protected Channels');
        }
        data.password = await argon.hash(data.password);
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
          image: '',
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
      this.gateway.newRoom(newChannel.id, newChannel.name, data.Members);
      data.Members.map((member) => {
        this.notifications.createNotification(userId, {
          receiverId: member,
          type: NotificationType.Channel,
          message: `You were added to channel ${newChannel.name}`,
        });
      });
      return newChannel;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async leaveChannel(channelId: string, userId: string) {
    //disconnect userId socket in the gateway
    try {
      const channel = await this.prisma.channel.findUnique({
        where: { id: channelId },
        include: { Members: true },
      });
      if (!channel) {
        throw new Error('Channel not found');
      }
      if (userId === channel.ownerId) {
        throw new Error('Owner cannot leave the channel without deleting it');
      }
      if (channel.Members.map((member) => member.id).indexOf(userId) === -1) {
        throw new Error('User not in the channel');
      }
      this.gateway.leaveRoom(channel.id, channel.name, userId);
      const updatedChannel = await this.prisma.channel.update({
        where: { id: channelId },
        data: {
          Members: {
            disconnect: {
              id: userId,
            },
          },
          admins: {
            disconnect: {
              id: userId,
            },
          },
        },
      });
      if (!updatedChannel) {
        throw new Error('Failed to leave channel');
      }
      //gateway.leaveRoom()
      return 'success';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async joinChannel(
    channelId: string,
    body: { password: string },
    userId: string,
  ) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: { id: channelId },
        include: { Members: true },
      });
      if (!channel) {
        throw new Error('Channel not found');
      }
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          ChannelsBannedFrom: true,
        },
      });
      if (!user) {
        throw new Error('Error retrieving user record');
      }
      if (channel.Members.map((member) => member.id).indexOf(user.id) !== -1) {
        throw new Error('User already in the channel');
      }
      if (
        user.ChannelsBannedFrom.map((ch) => ch.id).indexOf(channelId) !== -1
      ) {
        throw new Error(`User ${user.username} is banned from this channel`);
      }
      if (channel.type === ChannelType.PROTECTED) {
        if (body.password?.length === 0) {
          throw new Error('Password is required to join channel');
        }
        const pwMatch = await argon.verify(channel.password, body.password);
        if (!pwMatch) {
          throw new Error('Incorrect Password');
        }
      }
      this.gateway.joinRoom(channel.id, channel.name, userId);
      const updatedChannel = await this.prisma.channel.update({
        where: { id: channelId },
        data: {
          Members: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      if (!updatedChannel) {
        throw new Error('Failed to join channel');
      }
      return 'success';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

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
        bannedMembers: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    if (!channel) throw new BadRequestException('This channel does not exist');
    if (channel.admins.length === 0 && channel.ownerId !== userId) {
      throw new UnauthorizedException('Forbidden');
    }
    delete channel.password;
    return channel;
  }

  async unbanUser(userId: string, channelId: string, body: { id: string }) {
    try {
      const channel = await this.validateChannelUpdate(userId, channelId);
      const user = await this.prisma.user.findUnique({
        where: { id: body.id },
      });
      if (!user) {
        throw new Error('Error retrieving record user or channel');
      }
      if (
        channel.bannedMembers.map((member) => member.id).indexOf(user.id) == -1
      ) {
        throw new Error('Cannot unban, user is not banned');
      }
      const updatedChannel = await this.prisma.channel.update({
        where: {
          id: channel.id,
        },
        data: {
          bannedMembers: {
            disconnect: {
              id: user.id,
            },
          },
        },
      });
      if (!updatedChannel) {
        throw new Error('Failed to update record!');
      }
      this.notifications.createNotification(userId, {
        receiverId: user.id,
        type: NotificationType.Channel,
        message: `You were unbanned from channel ${channel.name}. You can request to join again`,
      });
      return 'success';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async banUser(userId: string, channelId: string, body: { id: string }) {
    try {
      const channel = await this.validateChannelUpdate(userId, channelId);
      const user = await this.prisma.user.findUnique({
        where: { id: body.id },
      });
      if (!user) {
        throw new Error('Error retrieving record user or channel');
      }
      if (channel.Members.map((member) => member.id).indexOf(user.id) == -1) {
        throw new Error('Cannot ban, user is not in the channel');
      }
      if (channel.ownerId === user.id) {
        throw new Error('Cannot ban channel owner');
      }
      const updatedChannel = await this.prisma.channel.update({
        where: {
          id: channel.id,
        },
        data: {
          Members: {
            disconnect: {
              id: user.id,
            },
          },
          admins: {
            disconnect: {
              id: user.id,
            },
          },
          bannedMembers: {
            connect: {
              id: user.id,
            },
          },
        },
      });
      if (!updatedChannel) {
        throw new Error('Failed to update record!');
      }
      this.gateway.leaveRoom(channel.id, channel.name, user.id);
      this.notifications.createNotification(userId, {
        receiverId: user.id,
        type: NotificationType.Channel,
        message: `You were banned from channel ${channel.name}`,
      });
      return 'success';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async kickMembers(
    userId: string,
    channelId: string,
    body: { members: string[] },
  ) {
    try {
      if (body.members?.length > 0) {
        if (!body.members) {
          throw new Error('Invalid members list');
        }
        const channel = await this.validateChannelUpdate(userId, channelId);
        await Promise.all(
          body.members.map(async (id) => {
            const user = await this.prisma.user.findUnique({
              where: { id },
            });
            if (!user) {
              throw new Error('Invalid User in members list');
            }
            if (
              channel.Members.map((member) => member.id).indexOf(user.id) == -1
            ) {
              throw new Error('Cannot kick, user is not in the channel');
            }
            if (channel.ownerId === id) {
              throw new Error('Cannot kick channel owner');
            }
            return user;
          }),
        );
        const updatedChannel = await this.prisma.channel.update({
          where: {
            id: channel.id,
          },
          data: {
            Members: {
              disconnect: body.members?.map((memberId: string) => ({
                id: memberId,
              })),
            },
            admins: {
              disconnect: body.members?.map((memberId: string) => ({
                id: memberId,
              })),
            },
          },
        });
        if (!updatedChannel) {
          throw new Error('Failed to update record!');
        }
        body.members.map((member) => {
          this.gateway.leaveRoom(channel.id, channel.name, member);
          this.notifications.createNotification(userId, {
            receiverId: member,
            type: NotificationType.Channel,
            message: `You were kicked from channel ${channel.name}`,
          });
        });
      }
      return 'success';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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
      throw new BadRequestException(error.message);
    }
  }

  async muteMembers(userId: string, channelId: string, members: string[]) {
    try {
      if (!members || members?.length === 0) {
        throw new Error('Invalid members list');
      }
      if (members?.length > 0) {
        const channel = await this.validateChannelUpdate(userId, channelId);
        await Promise.all(
          members.map(async (id) => {
            const user = await this.prisma.user.findUnique({ where: { id } });
            if (!user) {
              throw new Error('Invalid User in members list');
            }
            if (channel.Members.map((mbr) => mbr.id).indexOf(user.id) == -1) {
              throw new Error('User is not in the channel');
            }
            if (channel.ownerId === id) {
              throw new Error('Cannot mute channel owner');
            }
            await this.prisma.mutedChannelUsers.create({
              data: {
                user: {
                  connect: {
                    id: id,
                  },
                },
                channels: {
                  connect: {
                    id: channelId,
                  },
                },
                time: new Date().toISOString(),
              },
            });
            return user;
          }),
        );
      }
      return 'success';
    } catch (error) {
      throw new BadRequestException(error.message);
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
      throw new BadRequestException(error.message);
    }
  }

  async editChannelAvatar(
    userId: string,
    channelId: string,
    avatar: Express.Multer.File,
  ) {
    try {
      if (!avatar) {
        throw new Error('BadRequest');
      }
      await this.validateChannelUpdate(userId, channelId);
      const updatedChannel = await this.prisma.channel.update({
        where: {
          id: channelId,
        },
        data: {
          image: `http://localhost:3000/uploads/${avatar.filename}`,
        },
      });
      if (!updatedChannel) {
        throw new Error('Failed to update record');
      }
      return 'success';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async editChannelType(userId: string, channelId: string, body: editTypeDto) {
    try {
      if (body.type === ChannelType.PROTECTED) {
        if (body.password?.length === 0) {
          throw new Error('Password is required for Protected Channels');
        }
        body.password = await argon.hash(body.password);
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
      throw new BadRequestException(error.message);
    }
  }

  async addMembers(
    userId: string,
    channelId: string,
    body: { members: string[] },
  ) {
    try {
      if (body.members?.length > 0) {
        const channel = await this.validateChannelUpdate(userId, channelId);
        if (!body.members) {
          throw new Error('Invalid members list');
        }
        await Promise.all(
          body.members.map(async (id) => {
            const user = await this.prisma.user.findUnique({
              where: { id },
              include: {
                ChannelsBannedFrom: true,
              },
            });
            if (!user) {
              throw new Error('Invalid User in members list');
            }
            if (
              user.ChannelsBannedFrom.map((ch) => ch.id).indexOf(channel.id) !==
              -1
            ) {
              throw new Error(
                `User ${user.username} is banned from this channel`,
              );
            }
            return user;
          }),
        );
        const currentMembers = channel.Members.map((member) => {
          return member.id;
        });
        const members = currentMembers.concat(body.members);
        const updatedChannel = await this.prisma.channel.update({
          where: {
            id: channelId,
          },
          data: {
            Members: {
              connect: members?.map((memberId: string) => ({
                id: memberId,
              })),
            },
          },
        });
        if (!updatedChannel) {
          throw new Error('Failed to update record');
        }
        body.members.map((member) => {
          this.gateway.joinRoom(channel.id, channel.name, member);
          this.notifications.createNotification(userId, {
            receiverId: member,
            type: NotificationType.Channel,
            message: `You were added to channel ${updatedChannel.name}`,
          });
        });
      }
      return 'success';
    } catch (error) {
      throw new BadRequestException(error.message);
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
      throw new BadRequestException('Channel Not Found');
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
      throw new BadRequestException('Error occured while deleting record');
    }
  }
}
