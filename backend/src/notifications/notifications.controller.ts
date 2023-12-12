import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';


@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  @Post('createNotification')
  async createNotification(@Req() req, @Body() body) {
    console.log(body);
    return this.notificationsService.createNotification();
  }

  @Get('get-notifications')
  async getNotifications() {
    // i guess it will hold the logic for getting notifications
  }
}