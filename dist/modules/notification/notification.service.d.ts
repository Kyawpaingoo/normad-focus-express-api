import { PrismaService } from '../../database/prisma.service';
import { Notification } from '@prisma/client';
import { UpsertNotificationDto } from './dto/upsert-notification.dto';
export declare class NotificationService {
    private prisma;
    constructor(prisma: PrismaService);
    insert(data: UpsertNotificationDto): Promise<Notification>;
    update(id: number, notify_at: Date | null): Promise<Notification>;
}
