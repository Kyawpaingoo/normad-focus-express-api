export type upsertMeetingSchdeuleDto = {
    user_id: number,
    title: string,
    description: string, 
    start_time: Date,
    end_time: Date
}