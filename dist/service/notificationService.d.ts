import { Notification } from "@prisma/client";
import { upsertNotificationRequestDto } from "../dtos/notificationDto";
export declare const insert: (data: upsertNotificationRequestDto) => Promise<Notification>;
export declare const update: (id: number, notify_at: Date | null) => Promise<Notification>;
