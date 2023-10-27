import { Controller, Get, Post } from '@nestjs/common';

@Controller('game')
export class GameController {
  @Post('create-game')
  async createGame() {}

  @Get('challenge-friends')
  async challengeFriends() {
    // i guess it will hold the logic for challenging friends
  }

  @Get('challenge-random')
  async challengeRandom() {
    // i guess it will hold the logic for challenging random
  }
}
