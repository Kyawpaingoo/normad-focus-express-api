import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Task } from '@prisma/client';
import { UpsertTaskDto } from './dto/upsert-task.dto';
import {
  sortDirection,
  InfiniteScrollResponse,
  KanbanResponse,
  ViewMode,
  FlexibleResponse,
} from '../../common/types/pagination.types';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async insert(task: UpsertTaskDto): Promise<Task> {
    const result = await this.prisma.task.create({
      data: {
        title: task.title || null,
        description: task.description || null,
        status: task.status || 'To Do',
        priority: task.priority || 'Low',
        start_date: task.start_date || null,
        due_date: task.due_date || null,
        notify_at: task.notify_at || null,
        is_deleted: false,
        user_id: task.userId,
      },
    });

    if (!result) {
      throw new BadRequestException('Task insertion failed');
    }

    return result;
  }

  async getByID(id: number, userId: number): Promise<Task> {
    const result = await this.prisma.task.findFirst({
      where: {
        id: id,
        user_id: userId,
        is_deleted: false,
      },
    });

    if (!result) {
      throw new NotFoundException('Task not found');
    }

    return result;
  }

  async update(id: number, userId: number, task: UpsertTaskDto): Promise<Task> {
    const result = await this.prisma.task.update({
      where: {
        id: id,
        user_id: userId,
      },
      data: {
        title: task.title || null,
        description: task.description || null,
        status: task.status || 'To Do',
        priority: task.priority || 'Low',
        start_date: task.start_date || null,
        due_date: task.due_date || null,
        notify_at: task.notify_at || null,
        is_deleted: false,
        user_id: task.userId,
      },
    });

    if (!result) {
      throw new BadRequestException('Task update failed');
    }

    return result;
  }

  async softDelete(id: number, userId: number): Promise<string> {
    const result = await this.prisma.task.update({
      where: {
        id: id,
        user_id: userId,
      },
      data: {
        is_deleted: true,
      },
    });

    if (!result) {
      throw new BadRequestException('Task deletion failed');
    }

    return 'Task deleted successfully';
  }

  async hardDelete(id: number, userId: number): Promise<string> {
    const result = await this.prisma.task.delete({
      where: {
        id: id,
        user_id: userId,
      },
    });

    if (!result) {
      throw new BadRequestException('Task deletion failed');
    }

    return 'Task deleted successfully';
  }

  async getTasksByView(
    viewMode: ViewMode = 'board',
    cursor: string | null,
    limit: number,
    userId: number,
    year: number,
    month: number,
    sortDir: sortDirection = 'desc',
    q?: string,
    status?: string,
    priority?: string,
  ): Promise<FlexibleResponse<Task>> {
    if (viewMode === 'board') {
      return await this.getTaskForKanban(userId, year, month, sortDir, q, status, priority);
    } else {
      return await this.getTaskForInfiniteScroll(cursor, limit, userId, year, month, sortDir, q, status, priority);
    }
  }

  private async getTaskForInfiniteScroll(
    cursor: string | null,
    limit: number,
    userId: number,
    year: number,
    month: number,
    sortDir: sortDirection = 'desc',
    q?: string,
    status?: string,
    priority?: string,
  ): Promise<InfiniteScrollResponse<Task>> {
    const startDate: Date = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const endDate: Date = new Date(year, month, 0, 23, 59, 59, 999);

    const baseWhereClause = {
      user_id: userId,
      is_deleted: false,
      start_date: {
        gte: startDate,
        lte: endDate,
      },
      ...(q && {
        title: {
          contains: q,
          mode: 'insensitive' as const,
        },
      }),
      ...(status && { status }),
      ...(priority && { priority }),
    };

    const totalCount: number = await this.prisma.task.count({
      where: baseWhereClause,
    });

    const whereClause = {
      ...baseWhereClause,
      ...(cursor && {
        OR: [
          {
            start_date:
              sortDir === 'desc'
                ? { lt: new Date(cursor.split('_')[0]) }
                : { gt: new Date(cursor.split('_')[0]) },
          },
          {
            start_date: new Date(cursor.split('_')[0]),
            id:
              sortDir === 'desc'
                ? { lt: parseInt(cursor.split('_')[1]) }
                : { gt: parseInt(cursor.split('_')[1]) },
          },
        ],
      }),
    };

    const tasks: Task[] = await this.prisma.task.findMany({
      where: whereClause,
      orderBy: [
        {
          start_date: sortDir,
        },
        {
          id: sortDir,
        },
      ],
      take: limit + 1,
    });

    if (!tasks || tasks.length === 0) {
      return {
        results: [],
        nextCursor: null,
        hasNextPage: false,
        totalCount: totalCount || 0,
      };
    }

    const hasNextPage: boolean = tasks.length > limit;
    const results: Task[] = hasNextPage ? tasks.slice(0, limit) : tasks;

    if (!results || results.length === 0) {
      return {
        results: [],
        nextCursor: null,
        hasNextPage: false,
        totalCount: totalCount || 0,
      };
    }

    const lastResult: Task = results[results.length - 1];

    if (!lastResult) {
      return {
        results: [],
        nextCursor: null,
        hasNextPage: false,
        totalCount: totalCount || 0,
      };
    }

    const nextCursor = hasNextPage && results.length > 0 ? `${lastResult.start_date?.toISOString()}_${lastResult.id}` : null;

    return {
      results,
      nextCursor,
      hasNextPage,
      ...(totalCount !== undefined && { totalCount }),
    };
  }

  private async getTaskForKanban(
    userId: number,
    year: number,
    month: number,
    sortDir: sortDirection = 'desc',
    q?: string,
    status?: string,
    priority?: string,
  ): Promise<KanbanResponse<Task>> {
    const startDate: Date = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const endDate: Date = new Date(year, month, 0, 23, 59, 59, 999);

    const whereClause = {
      user_id: userId,
      is_deleted: false,
      start_date: {
        gte: startDate,
        lte: endDate,
      },
      ...(q && {
        title: {
          contains: q,
          mode: 'insensitive' as const,
        },
      }),
      ...(status && { status }),
      ...(priority && { priority }),
    };

    const tasks = await this.prisma.task.findMany({
      where: whereClause,
      orderBy: [
        {
          start_date: sortDir,
        },
        {
          id: sortDir,
        },
      ],
    });

    if (!tasks || tasks.length === 0) {
      return {
        columns: {},
        totalCount: 0,
      };
    }

    const taskByStatus = tasks.reduce((acc, task) => {
      const status: string | null = task.status || 'to do';
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    const columnConfig = {
      todo: { title: 'To Do', order: 1 },
      in_progress: { title: 'In Progress', order: 2 },
      done: { title: 'Done', order: 3 },
    };

    const columns = Object.entries(columnConfig).reduce((acc, [statusKey, config]) => {
      const items = taskByStatus[config.title] || [];
      acc[statusKey] = {
        title: config.title,
        items,
        totalCount: items.length,
      };
      return acc;
    }, {} as Record<string, { title: string; items: Task[]; totalCount: number }>);

    return {
      columns,
      totalCount: tasks.length,
    };
  }
}
