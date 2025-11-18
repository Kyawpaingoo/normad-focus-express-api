export declare enum TaskStatus {
    TODO = "To Do",
    IN_PROGRESS = "In Progress",
    DONE = "Done"
}
export declare enum TaskPriority {
    HIGH = "High",
    MEDIUM = "Medium",
    LOW = "Low"
}
export declare class UpsertTaskDto {
    userId: number;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    start_date: Date;
    due_date: Date;
    notify_at?: Date;
}
