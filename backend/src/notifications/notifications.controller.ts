import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';


@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  @Post('createNotification')
  async createNotification(@Req() req, @Body() body) {
    return this.notificationsService.createNotification(body.sender, body.receiver);
  }

  @Get('get-notifications')
  async getNotifications(@Req() req, @Body() body) {
    return this.notificationsService.getNotification(body.notificationId);
  }
}