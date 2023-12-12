import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { NotificationType } from "@prisma/client";


@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) {}

    async createNotification() {
     const sender = await this.prisma.user.findUnique({
         where: { id: "2dc04dff-c2b3-4aa9-aa15-ede086c7ddf5" },
         })
    const receiver = await this.prisma.user.findUnique({
        where: { id: "3f3edd2e-a0cb-4d59-bbf7-65f7e1ba2314" },
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

}