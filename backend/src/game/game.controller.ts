import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import { GameRequestDTO } from 'src/dto/game.dto';
import { ChatGuard } from 'src/guards/chat.jwt.guard';

@Controller('game')
@UseGuards(ChatGuard)
export class GameController {
  constructor(private gameService: GameService) {}

  @Post(':id/send-game-request')
  async sendGameRequest(
    @Body() sender: GameRequestDTO,
    @Param() receiver: GameRequestDTO,
  ) {
    if (sender && receiver) {
      return this.gameService.sendGameRequest(sender.id, receiver.id);
    } else {
      throw new BadRequestException('Invalid sender or receiver data.');
    }
  }

  @Post('accept/:id')
  async acceptGameRequest(
    @Param() receiver: GameRequestDTO,
    @Body() sender: GameRequestDTO,
  ) {
    if (receiver && sender) {
      return this.gameService.acceptGameRequest(sender.id, receiver.id);
    } else {
      throw new BadRequestException('Invalid sender or receiver data.');
    }
  }

  @Post('refuse/:id')
  async refuseGameRequest(
    @Param() receiver: GameRequestDTO,
    @Body() sender: GameRequestDTO,
  ) {
    if (receiver && sender) {
      return this.gameService.declineGameRequest(sender.id, receiver.id);
    } else {
      throw new BadRequestException('Invalid sender or receiver data.');
    }
  }

  @Get('MatchHistory/:id')
  async getMatchHistory(@Param('id') param) {
    console.log('heeeeeeey');
    if (param) {
      return this.gameService.getMatchHistory(param);
    } else {
      throw new BadRequestException('Invalid user data recent games.');
    }
  }

  @Post('endgame')
  async endGame(@Req() req: any, @Body() body: any) {
    if (req.userID) {
      return this.gameService.endGame(body.winnerId, body.loserId);
    } else {
      throw new BadRequestException('Invalid user data.');
    }
  }

  @Get('getLoses/:id')
  async getLoses(@Param() param: any) {
    if (param.id) {
      return this.gameService.getPlayerLoses(param.id);
    } else {
      throw new BadRequestException('Invalid user data.');
    }
  }

  @Get('getWins/:id')
  async getWins(@Param() param: any) {
    if (param.id) {
      console.log(param.id);
      return this.gameService.getPlayerWins(param.id);
    } else {
      throw new BadRequestException('Invalid user data.');
    }
  }

  @Get('getCurrentGame/:id')
  async getCurrentGame(@Param() param: any) {
    if (param.id) {
      return this.gameService.getCurrentGame(param.id);
    } else {
      throw new BadRequestException('Invalid user data.');
    }
  }

  @Get('TotalGames/:id')
  async getTotalGames(@Param() param: any) {
    if (param.id) {
      return this.gameService.getTotalGames(param.id);
    } else {
      throw new BadRequestException('Invalid user data.');
    }
  }

  @Get('TotalAchievement/:id')
  async getTotalAchievement(@Param() param: any) {
    if (param.id) {
      return this.gameService.getTotalAchievement(param.id);
    } else {
      throw new BadRequestException('Invalid user data.');
    }
  }

  @Get('achievements/:id')
  async getAchievements(@Param('id') id: string) {
    if (!id) {
      return new BadRequestException('invalid user Id');
    }
    return this.gameService.getAchievements(id);
  }
}
