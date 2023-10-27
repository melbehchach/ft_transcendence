import {
  Controller,
  Get,
  InternalServerErrorException,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserGuard } from 'src/guards/user.jwt.guard';

@Controller('user')
@UseGuards(UserGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private prisma: PrismaService,
  ) {}
  @Get('profile')
  getProfile(@Req() req) {
    if (!req.user) throw new InternalServerErrorException('Bad BadRequest');
    const {
      id,
      username,
      avatar,
      friends,
      sentRequests,
      receivedRequests,
      sentMessages,
      receivedMessages,
      ChannelsOwner,
      ChannelsAdmin,
      ChannelsMember,
    } = req.user;
    return {
      id,
      username,
      avatar,
      friends,
      sentRequests,
      friendRequests: receivedRequests,
      sentMessages,
      receivedMessages,
      ChannelsOwner,
      ChannelsAdmin,
      ChannelsMember,
    };
  }

  @Post('sendRequest')
  async sendRequest(@Req() req) {
    if (req.body.senderId && req.body.receiverId) {
      return this.userService.sendFriendRequest(req.body, req.user.id);
    }
    throw new InternalServerErrorException('Bad BadRequest');
  }

  @Patch('unfriendUser')
  async unfriendUser(@Req() req) {
    if (req.user && req.body.friendId) {
      return this.userService.unfriendUser(req.body.friendId, req.user.id);
    }
    throw new InternalServerErrorException('Bad BadRequest');
  }

  @Patch('cancelRequest')
  async cancelRequest(@Req() req) {
    if (req.user && req.body.friendRequestId) {
      const friendRequest = await this.prisma.friendRequest.findUnique({
        where: {
          id: req.body.friendRequestId,
        },
      });
      return friendRequest
        ? this.userService.cancelFriendRequest(friendRequest, req.user.id)
        : { msg: 'Internal Server Error: requestNotFound' };
    }
    throw new InternalServerErrorException('Bad BadRequest');
  }

  @Patch('acceptRequest')
  async acceptRequest(@Req() req) {
    if (req.user && req.body.friendRequestId) {
      const friendRequest = await this.prisma.friendRequest.findUnique({
        where: {
          id: req.body.friendRequestId,
        },
      });
      return friendRequest
        ? this.userService.acceptFriendRequest(friendRequest, req.user.id)
        : { msg: 'Internal Server Error: requestNotFound' };
    }
    throw new InternalServerErrorException('Bad BadRequest');
  }

  @Patch('declineRequest')
  async declineRequest(@Req() req) {
    if (req.user && req.body.friendRequestId) {
      const friendRequest = await this.prisma.friendRequest.findUnique({
        where: {
          id: req.body.friendRequestId,
        },
      });
      return friendRequest
        ? this.userService.declineFriendRequest(friendRequest, req.user.id)
        : { msg: 'Internal Server Error: requestNotFound' };
    }
    throw new InternalServerErrorException('Bad BadRequest');
  }
}
