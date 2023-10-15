import { Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
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
    const { username, avatar, sentRequests, receivedRequests, friends } =
      req.user;
    return {
      username,
      avatar: avatar,
      friends,
      sentRequests,
      friendRequests: receivedRequests,
    };
  }

  @Post('sendRequest')
  async sendRequest(@Req() req) {
    if (req.body.senderId && req.body.receiverId) {
      return this.userService.sendFriendRequest(req.body, req.user.id);
    }
    return { msg: 'Internal Server Error: BadRequest' };
  }

  @Patch('unfriendUser')
  async unfriendUser(@Req() req) {
    if (req.user && req.body.friendId) {
      return this.userService.unfriendUser(req.body.friendId, req.user.id);
    }
    return { msg: 'Internal Server Error: BadRequest' };
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
    return { msg: 'Internal Server Error: BadRequest' };
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
    return { msg: 'Internal Server Error: BadRequest' };
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
    return { msg: 'Internal Server Error: BadRequest' };
  }
}
