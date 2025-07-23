import { Notification } from "@prisma/client";
import { upsertNotificationRequestDto } from "../dtos/notificationDto";
import prisma from "../prisma";

export const insert = async (data: upsertNotificationRequestDto): Promise<Notification> => {
    const result: Notification | undefined = await prisma?.notification.create({
        data: {
            user_id: data.user_id,
            source_type: data.source_type,
            source_id: data.source_id,
            message: data.message,
            notify_at: data.notify_at,
            created_at: new Date(),
            sent_at: null
        }
    });

    if(!result) throw new Error("Notification insertion failed");

    return result;
}

export const update = async (id: number, notify_at: Date | null): Promise<Notification> => {
    const result: Notification | undefined = await prisma?.notification.update({
        where: {
            id: id
        },
        data: {
            notify_at: notify_at
        }
    });

    if(!result) throw new Error("Notification update failed");

    return result;
}