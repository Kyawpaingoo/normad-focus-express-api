import { Request, Response } from "express"
import * as taskService from '../service/taskService';
import { upsertTaskDto } from "../dtos/taskDto";
import { errorResponse, successResponse } from "../utils/jsonResponse";
import { PaginationResponse, sortDirection } from "../utils/pagination";
import { Task } from "@prisma/client";
export const createTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await taskService.insert(req.body as upsertTaskDto);

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

export const getByPaging = async (req: Request, res: Response): Promise<void> => {
    try {
        const {page, pageSize, userId, year, month, sortDir, q, status, priority} = req.query;

        const result: PaginationResponse<Task> = await taskService.getByPaging(parseInt(page as string), parseInt(pageSize as string), parseInt(userId as string), parseInt(year as string), parseInt(month as string), sortDir as sortDirection, q as string, status as string, priority as string);

        successResponse(res, result, "Task details fetched successfully");
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