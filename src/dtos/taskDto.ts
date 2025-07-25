export type upsertTaskDto = {
    userId: number,
    title: string,
    description: string,
    status: 'To Do' | 'In Progress' | 'Done',
    priority: 'High' | 'Medium' | 'Low',
    start_date: Date,
    due_date: Date,
    notify_at: Date
}