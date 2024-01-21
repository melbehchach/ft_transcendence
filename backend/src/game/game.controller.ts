import { BadRequestException, Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
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
  async acceptGameRequest(@Param() receiver: GameRequestDTO, @Body() sender: GameRequestDTO) {
    if (receiver && sender){
        return this.gameService.acceptGameRequest(sender.id, receiver.id);
    }else {
        throw new BadRequestException('Invalid sender or receiver data.');
    }
  }

  @Post('refuse/:id')
  async refuseGameRequest(@Param() receiver: GameRequestDTO,@Body() sender: GameRequestDTO) {
    if (receiver && sender){
        return this.gameService.declineGameRequest(sender.id, receiver.id);
    }else{
        throw new BadRequestException('Invalid sender or receiver data.');
    }
  }

  @Get('MatchHistory')
  async getMatchHistory(@Req() req: any) {
    if (req.userID) {
      return this.gameService.getMatchHistory(req.userID);
    } else {
      throw new BadRequestException('Invalid user data.');
    }
  }
}


