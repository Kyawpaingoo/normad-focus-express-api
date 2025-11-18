import { Response } from 'express';
import { TaskService } from './task.service';
import { NotificationService } from '../notification/notification.service';
import { UpsertTaskDto } from './dto/upsert-task.dto';
export declare class TaskController {
    private readonly taskService;
    private readonly notificationService;
    constructor(taskService: TaskService, notificationService: NotificationService);
    createTask(taskDto: UpsertTaskDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getTaskByID(id: number, userId: number, res: Response): Promise<Response<any, Record<string, any>>>;
    updateTask(id: number, userId: number, taskDto: UpsertTaskDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getByView(query: any, res: Response): Promise<Response<any, Record<string, any>>>;
    softDeleteTask(id: number, userId: number, res: Response): Promise<Response<any, Record<string, any>>>;
    hardDeleteTask(id: number, userId: number, res: Response): Promise<Response<any, Record<string, any>>>;
}
