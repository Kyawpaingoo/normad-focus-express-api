export type upsertNotificationRequestDto = {
    user_id: number,
    source_type: string,
    source_id: number,
    title: string | null,
    message: string,
    notify_at: Date
}