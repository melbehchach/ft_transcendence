import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserGuard } from 'src/guards/user.jwt.guard';
import { searchDto } from 'src/dto/search.dto';

@Controller('user')
@UseGuards(UserGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private prisma: PrismaService,
  ) {}
  @Get('profile')
  getProfile(@Req() req) {
    if (!req.user) {
      throw new InternalServerErrorException('BadRequest');
    }
    return {
      id: req.user.id,
      username: req.user.username,
      avatar: req.user.avatar,
      friends: req.user.friends,
      sentRequests: req.user.sentRequests,
      friendRequests: req.user.receivedRequests,
      sentMessages: req.user.sentMessages,
      receivedMessages: req.user.receivedMessages,
      ChannelsOwner: req.user.ChannelsOwner,
      ChannelsAdmin: req.user.ChannelsAdmin,
      ChannelsMember: req.user.ChannelsMember,
      ChannelsBannedFrom: req.user.ChannelsBannedFrom,
    };
  }

  @Get('search')
  async search(@Query() params: searchDto) {
    return this.userService.search(params);
  }

  @Get(':id/profile')
  getUserProfile(@Param('id') userId: string) {
    if (!userId) {
      throw new InternalServerErrorException('BadRequest');
    }
    return this.userService.getUSerProfile(userId);
  }

  @Post('sendRequest')
  async sendRequest(@Req() req) {
    if (req.user && req.body.receiverId) {
      return this.userService.sendFriendRequest(req.body, req.user.id);
    }
    throw new InternalServerErrorException('BadRequest');
  }

  @Patch('unfriendUser')
  async unfriendUser(@Req() req) {
    if (req.user && req.body.friendId) {
      return this.userService.unfriendUser(req.body.friendId, req.user.id);
    }
    throw new InternalServerErrorException('BadRequest');
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
    throw new InternalServerErrorException('BadRequest');
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
    throw new InternalServerErrorException('BadRequest');
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
    throw new InternalServerErrorException('BadRequest');
  }
}
