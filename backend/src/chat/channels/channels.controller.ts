import { Body, Controller, Get, Patch, Post } from '@nestjs/common';

@Controller('channels')
export class ChannelsController {
  constructor() {}

  @Get('all')
  async getChannels() {}

  @Post('create')
  async createChannel(@Body() body) {
    console.log(body);
  }

  @Patch('update')
  async updateChannel(@Body() body) {
    console.log(body);
  }
}
