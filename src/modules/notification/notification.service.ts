import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Notification } from '@prisma/client';
import { UpsertNotificationDto } from './dto/upsert-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async insert(data: UpsertNotificationDto): Promise<Notification> {
    const result = await this.prisma.notification.create({
      data: {
        ...data,
        created_at: new Date(),
        sent_at: null,
      },
    });

    if (!result) {
      throw new BadRequestException('Notification insertion failed');
    }

    return result;
  }

  async update(id: number, notify_at: Date | null): Promise<Notification> {
    const result = await this.prisma.notification.update({
      where: {
        id: id,
      },
      data: {
        notify_at: notify_at,
      },
    });

    if (!result) {
      throw new BadRequestException('Notification update failed');
    }

    return result;
  }
}
