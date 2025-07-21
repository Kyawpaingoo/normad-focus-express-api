import { Request, Response } from "express"
import * as taskService from '../service/taskService';
import { upsertTaskDto } from "../dtos/taskDto";
import { errorResponse, successResponse } from "../utils/jsonResponse";
import { FlexibleResponse, PaginationResponse, sortDirection, ViewMode } from "../utils/pagination";
import * as notificationService from '../service/notificationService';
import { Task } from "@prisma/client";
import { upsertNotificationRequestDto } from "../dtos/notificationDto";
export const createTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await taskService.insert(req.body as upsertTaskDto);

        if(result.notify_at != null)
        {
            const notificationDto: upsertNotificationRequestDto = {
                user_id: result.user_id, 
                source_type: "Task", 
                source_id: result.id, 
                title: result.title,
                message: `You have a task to do at ${result.notify_at}`, 
                notify_at: result.notify_at
            };
            await notificationService.insert(notificationDto);
        }

        successResponse(res, result, "Task created successfully");
    }
    catch (error: any) {
        errorResponse(error as Error, 400, error.message, res);
    }
}

export const getTaskByID = async (req: Request, res: Response): Promise<void> => {
    try {
        const {id, userId} = req.params;
        const result = await taskService.getByID(parseInt(id), parseInt(userId));
        successResponse(res, result, "Task details fetched successfully");
    }
    catch(error: any) {
        errorResponse(error as Error, 400, error.message, res);
    }
}

export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const {id, userId} = req.params;
        const result = await taskService.update(parseInt(id), parseInt(userId), req.body as upsertTaskDto);
        successResponse(res, result, "Task updated successfully");
    }
    catch(error: any) {
        errorResponse(error as Error, 400, error.message, res);
    }
}

export const getByView = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            viewMode = 'list',
            cursor,
            limit = '20',
            userId,
            year,
            month,
            sortDir,
            q,
            status,
            priority,
        } = req.query;

        const limitNum = parseInt(limit as string);
        if (limitNum > 100) {
            return errorResponse(
                new Error('Limit too large'),
                400,
                'Limit cannot exceed 100 items',
                res
            );
        }

        const view = viewMode as ViewMode;
        const result: FlexibleResponse<Task> = await taskService.getTasksByView(view, cursor as string || null, limitNum, parseInt(userId as string), parseInt(year as string), parseInt(month as string), sortDir as sortDirection, q as string, status as string, priority as string);
        
        successResponse(res, result, `Tasks fetched successfully for ${view} view`);
    }
    catch(error: any) {
        errorResponse(error as Error, 400, error.message, res);
    }
}

export const softDeleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const {id, userId} = req.params;
        const result = await taskService.softDelete(parseInt(id), parseInt(userId));
        successResponse(res, result, "Task deleted successfully");
    }
    catch(error: any) {
        errorResponse(error as Error, 400, error.message, res);
    }
}

export const hardDeleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const {id, userId} = req.params;
        const result = await taskService.hardDelete(parseInt(id), parseInt(userId));
        successResponse(res, result, "Task deleted successfully");
    }
    catch(error: any) {
        errorResponse(error as Error, 400, error.message, res);
    }
}