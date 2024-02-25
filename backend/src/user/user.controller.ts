import {
  Body,
  Controller,
  Get,
  BadRequestException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserGuard } from 'src/guards/user.jwt.guard';
import { searchDto } from 'src/dto/search.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { isEnum } from 'class-validator';
import { GameTheme, userStatus } from '@prisma/client';

@Controller('user')
@UseGuards(UserGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private prisma: PrismaService,
  ) {}

  @Get('profile')
  async getProfile(@Req() req) {
    if (!req.user) {
      throw new BadRequestException('BadRequest');
    }
    return this.userService.getProfile(req.user.id);
  }

  @Get('friends')
  async getFriends(@Req() req) {
    if (!req.user) {
      throw new BadRequestException('BadRequest');
    }
    return this.userService.getFriends(req.user.id);
  }

  @Get('status/get')
  async getUserStatus(@Req() req) {
    if (!req.user) {
      throw new BadRequestException('BadRequest');
    }
    return this.userService.getUserStatus(req.user.id);
  }

  @Patch('status/update')
  async updateUserStatus(@Req() req) {
    console.log(req.user, req.body.status, userStatus);
    if (!req.user || !req.body.status || !isEnum(req.body.status, userStatus)) {
      throw new BadRequestException('BadRequest');
    }
    return this.userService.updateUserStatus(req.user.id, req.body.status);
  }

  @Get('friendRequests')
  async getFriendRequests(@Req() req) {
    if (!req.user) {
      throw new BadRequestException('BadRequest');
    }
    return this.userService.getFriendRequests(req.user.id);
  }

  @Patch('settings/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}_${file.originalname}`);
        },
      }),
    }),
  )
  async updateAvatar(@Req() req, @UploadedFile() avatar) {
    if (!avatar) {
      return new BadRequestException({ error: 'missing file' });
    }
    return this.userService.editAvatar(req.user.id, avatar);
  }

  @Patch('settings/username')
  async editUsername(@Req() req, @Body() body) {
    if (!body.username) {
      return new BadRequestException({ error: 'missing username' });
    }
    return this.userService.editUsername(req.user.id, body.username);
  }

  @Patch('settings/password')
  async editPassword(@Req() req, @Body() body) {
    if (!body.old_password || !body.new_password) {
      return new BadRequestException({ error: 'missing data' });
    }
    return this.userService.editPassword(
      req.user.id,
      body.old_password,
      body.new_password,
    );
  }

  @Patch('settings/theme')
  async editTheme(@Req() req, @Body() body) {
    if (!body.theme || !isEnum(body.theme, GameTheme)) {
      return new BadRequestException({
        error: 'missing or invalid data',
      });
    }
    return this.userService.editTheme(req.user.id, body.theme);
  }

  @Get('search')
  async search(@Query() params: searchDto) {
    return this.userService.search(params);
  }

  @Get(':id/profile')
  async getUserProfile(@Param('id') userId: string) {
    if (!userId) {
      throw new BadRequestException('BadRequest');
    }
    return this.userService.getUSerProfile(userId);
  }

  @Post('sendRequest')
  async sendRequest(@Req() req) {
    if (req.user && req.body.receiverId) {
      return this.userService.sendFriendRequest(req.body, req.user.id);
    }
    throw new BadRequestException('BadRequest');
  }

  @Patch('unfriendUser')
  async unfriendUser(@Req() req) {
    if (req.user && req.body.friendId) {
      return this.userService.unfriendUser(req.body.friendId, req.user.id);
    }
    throw new BadRequestException('BadRequest');
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
    throw new BadRequestException('BadRequest');
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
    throw new BadRequestException('BadRequest');
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
    throw new BadRequestException('BadRequest');
  }

  @Patch('block')
  async blockUser(@Req() req) {
    if (req.user && req.body.friendId) {
      return this.userService.blockUser(req.body.friendId, req.user.id);
    }
  }

  @Patch('unblock')
  async unblockUser(@Req() req) {
    if (req.user && req.body.friendId) {
      return this.userService.unblockUser(req.body.friendId, req.user.id);
    }
  }
}
