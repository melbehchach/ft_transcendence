import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ChatGuard } from 'src/guards/chat.jwt.guard';

@Controller('notifications')
@UseGuards(ChatGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get(':id/get')
  async getNotification(@Req() req, @Param('id') notificationId) {
    return this.notificationsService.getNotification(
      notificationId,
      req.userID,
    );
  }

  @Get('get/all')
  async getAllNotifications(@Req() req) {
    return this.notificationsService.getNotifications(req.userID);
  }

  @Patch(':id/delivered')
  async markDelivered(@Param('id') notificationId) {
    return this.notificationsService.markDelivered(notificationId);
  }

  @Patch(':id/read')
  async markRead(@Param('id') notificationId) {
    return this.notificationsService.markRead(notificationId);
  }
}
