import { Task } from "@prisma/client";
import { upsertTaskDto } from "../dtos/taskDto";
import { sortDirection, InfiniteScrollResponse, KanbanResponse, ViewMode, FlexibleResponse } from '../utils/pagination';
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

export const getTasksByView = async (viewMode: ViewMode = 'board', cursor: string | null, limit: number, userId: number, year: number, month: number, sortDir: sortDirection = 'desc', q?: string, status?: string, priority?:string): Promise<FlexibleResponse<Task>> => {
    if(viewMode === 'board') {
        return await getTaskForKanban(userId, year, month, sortDir, q, status, priority);
    }
    else {
        return await getTaskForInfiniteScroll(cursor, limit, userId, year, month, sortDir, q, status, priority);
    }
}

export const getTaskForInfiniteScroll = async (cursor: string | null, limit: number, userId: number, year: number, month: number, sortDir: sortDirection ='desc', q?: string, status?: string, priority?:string): Promise<InfiniteScrollResponse<Task>> => {
    const startDate: Date = new Date(year, month - 1, 1, 0, 0, 0, 0);

    const endDate: Date = new Date(year, month, 0, 23, 59, 59, 999);

    const baseWhereClause  = {
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

    const totalCount: number = await prisma.task.count({
        where: baseWhereClause
    });

    const whereClause = {
        ...baseWhereClause,
        ...(cursor && {
            OR: [
                {
                    start_date: sortDir === 'desc' ? { lt: new Date(cursor.split('_')[0]) } : { gt: new Date(cursor.split('_')[0]) }
                },
                {
                    start_date: new Date(cursor.split('_')[0]),
                    id: sortDir === 'desc' ? { lt: parseInt(cursor.split('_')[1]) } : { gt: parseInt(cursor.split('_')[1]) }
                }
            ]
        })
    };

    const tasks: Task[] = await prisma?.task.findMany({
        where: whereClause,
        orderBy: [
            {
                start_date: sortDir
            },
            {
                id: sortDir
            }
        ],
        take: limit + 1
    });

    if (!tasks || tasks.length === 0) {
        return {
            results: [],
            nextCursor: null,
            hasNextPage: false,
            totalCount: totalCount || 0
        };
    }

    const hasNextPage: boolean = tasks.length > limit;
    const results: Task[] = hasNextPage ? tasks.slice(0, limit) : tasks;

    if(!results || results.length === 0) return {
        results: [],
        nextCursor: null,
        hasNextPage: false,
        totalCount: totalCount || 0
    };

    const lastResult: Task = results[results.length -1];

    if(!lastResult) return {
        results: [],
        nextCursor: null,
        hasNextPage: false,
        totalCount: totalCount || 0
    };
    
    const nextCursor = hasNextPage && results.length > 0 
        ? `${lastResult.start_date?.toISOString()}_${lastResult.id}`
        : null;

    return {
        results,
        nextCursor,
        hasNextPage,
        ...(totalCount !== undefined && { totalCount })
    };
}

export const getTaskForKanban = async (userId: number, year: number, month: number, sortDir: sortDirection = 'desc', q?: string, status?: string, priority?:string): Promise<KanbanResponse<Task>> => {
    const startDate: Date = new Date(year, month - 1, 1, 0, 0, 0, 0);

    const endDate: Date = new Date(year, month, 0, 23, 59, 59, 999);   
    
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
    }

    const tasks = await prisma?.task.findMany({
        where: whereClause,
        orderBy: [
            {
                start_date: sortDir
            },
            {
                id: sortDir
            }
        ]
    });

    if (!tasks || tasks.length === 0) {
        return {
            columns: {},
            totalCount: 0,
        };
    }

    const taskByStatus = tasks.reduce((acc, task)=> {
        const status: string | null = task.status || 'to do';
        if(!acc[status])
        {
            acc[status] = [];
        }
        acc[status].push(task);
        return acc;
    }, {} as Record<string, Task[]>);

    const columnConfig = {
        todo: {title: 'To Do', order: 1},
        in_progress: {title: 'In Progress', order: 2},
        done: {title: 'Done', order: 3}
    };

    const columns = Object.entries(columnConfig).reduce((acc, [statusKey, config]) => {
        const items = taskByStatus[config.title] || [];
        acc[statusKey] = {
            title: config.title,
            items,
            totalCount: items.length
        };
        return acc;
    }, {} as Record<string, { title: string; items: Task[]; totalCount: number }>);

    return {
        columns,
        totalCount: tasks.length,
    }
}