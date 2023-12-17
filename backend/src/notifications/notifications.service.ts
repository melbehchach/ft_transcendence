import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { NotificationType } from "@prisma/client";


@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) {}

    async createNotification(senderId: string, receiverId: string) {
     const sender = await this.prisma.user.findUnique({
         where: { id: senderId },
         })
    const receiver = await this.prisma.user.findUnique({
        where: { id: receiverId },
        })
    if (!sender || !receiver) {
        throw new Error('Internal Server Error: cannotSendRequest');
    }
    const notification = await this.prisma.notification.create({
        data: {
            sender: {
                connect: {
                    id: sender.id,
                },
            },
            receiver: {
                connect: {
                    id: receiver.id,
                },
            },
            type: NotificationType.GameRequest,
        },
    });
    return notification
}

    async getNotification(notificationId: string) {
        const notifications = await this.prisma.notification.findMany({
            where: {
                receiverId: notificationId,
            },
            include: {
                sender: true,
            },
        });
        return notifications;
    }

}