import { Task } from "@prisma/client";
import { upsertTaskDto } from "../dtos/taskDto";
import { sortDirection, PaginationResponse } from '../utils/pagination';
import prisma from "../prisma";

export const insert = async (task: upsertTaskDto): Promise<Task> => {
    const result: Task | undefined = await prisma?.task.create({
        data: {
            user_id: task.userId,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            start_date: task.start_date,
            due_date: task.due_date,
            notify_at: task.notify_at,
            is_deleted: false
        }
    });

    if(!result) throw new Error("Task insertion failed");

    return result;
}

export const getByID = async (id: number, userId: number): Promise<Task> => {
    const result: Task | null | undefined = await prisma?.task.findFirst({
        where: {
            id: id,
            user_id: userId,
            is_deleted: false
        }
    });

    if(!result) throw new Error("Task not found");

    return result;
}

export const update = async (id: number, userId: number, task: upsertTaskDto): Promise<Task> => {
    const result: Task | undefined = await prisma?.task.update({
        where: {
            id: id,
            user_id: userId
        },
        data: {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            start_date: task.start_date,
            due_date: task.due_date,
            notify_at: task.notify_at
        }
    });
    
    if(!result) throw new Error("Task update failed");

    return result;
}

export const softDelete = async (id: number, userId: number): Promise<string> => {
    const result: Task | undefined = await prisma?.task.update({
        where: {
            id: id,
            user_id: userId
        },
        data: {
            is_deleted: true
        }
    });
    
    if(!result) throw new Error("Task deletion failed");

    return "Task deleted successfully";
}

export const hardDelete = async (id: number, userId: number): Promise<string> => {
    const result: Task | undefined = await prisma?.task.delete({
        where: {
            id: id,
            user_id: userId
        }
    });
    
    if(!result) throw new Error("Task deletion failed");

    return "Task deleted successfully";
}

export const getByPaging = async (page: number, pageSize: number, userId: number, year: number, month: number, sortDir: sortDirection = 'desc', q?: string, status?: string, priority?: string): Promise<PaginationResponse<Task>> => {
    
    const startDate = new Date(year, month -1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const whereClause = {
        user_id: userId,
        is_deleted: false,
        start_date: {
            gte: startDate,
            lte: endDate
        },
        ...(q && {
            title: {
                contains: q,
                mode: 'insensitive' as const
            }
        }),
        ...(status && { status }),
        ...(priority && { priority })
    };

    const totalCount = await prisma.task.count({
        where: whereClause
    });

    const totalPage = Math.ceil(totalCount / pageSize);

    const tasks = await prisma?.task.findMany({
        where: whereClause,
        orderBy: {
            start_date: sortDir
        },
        skip: (page - 1) * pageSize,
        take: pageSize
    });

    if(!tasks || tasks.length === 0) return {
        totalCount: 0,
        totalPage: 0,
        results: [],
        page: 0,
        pageSize: 0,
        hasNextPage: false,
        hasPrevPage: false
    };
    
    const results: PaginationResponse<Task> = {
        totalCount,
        totalPage: totalPage,
        page,
        pageSize,
        hasNextPage: page < totalPage,
        hasPrevPage: page > 1,
        results: tasks
    };
    
    return results;
}