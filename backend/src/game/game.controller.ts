import { Controller, Get, Post, Req } from '@nestjs/common';

@Controller('game')
export class GameController {
  @Post('create-game')
  async createGame() {}

  @Get('challenge-friends')
  async challengeFriends() {
    // i guess it will hold the logic for challenging friends
  }

  @Get('challenge-random')
  async challengeRandom(@Req() req) {
    // i guess it will hold the logic for challenging random
  }
}
