import { PrismaService } from '../../database/prisma.service';
import { Task } from '@prisma/client';
import { UpsertTaskDto } from './dto/upsert-task.dto';
import { sortDirection, ViewMode, FlexibleResponse } from '../../common/types/pagination.types';
export declare class TaskService {
    private prisma;
    constructor(prisma: PrismaService);
    insert(task: UpsertTaskDto): Promise<Task>;
    getByID(id: number, userId: number): Promise<Task>;
    update(id: number, userId: number, task: UpsertTaskDto): Promise<Task>;
    softDelete(id: number, userId: number): Promise<string>;
    hardDelete(id: number, userId: number): Promise<string>;
    getTasksByView(viewMode: ViewMode, cursor: string | null, limit: number, userId: number, year: number, month: number, sortDir?: sortDirection, q?: string, status?: string, priority?: string): Promise<FlexibleResponse<Task>>;
    private getTaskForInfiniteScroll;
    private getTaskForKanban;
}
