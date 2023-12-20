import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {

    constructor(private gameService: GameService) {}

    @Post('sendgamerequest')
    async sendGameRequest(@Body() body: any) {
        return this.gameService.sendGameRequest(body.sender, body.receiver);
    }

    @Post('accept')
    async acceptGameRequest(@Body() body: any) {
        return this.gameService.acceptGameRequest(body.sender, body.receiver);
    }

    @Post('refuse')
    async refuseGameRequest(@Body() body: any) {
        return this.gameService.declineGameRequest(body.sender, body.receiver);
    }

    @Get('MatchHistory')
    async getMatchHistory(@Req() req: any, @Body() body: any) {
        return this.gameService.getMatchHistory(req.params.id);
    }
}
