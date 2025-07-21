import { Notification } from "@prisma/client";
import { upsertNotificationRequestDto } from "../dtos/notificationDto";

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