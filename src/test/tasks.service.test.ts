import { PrismaClient, Task } from "@prisma/client";
import { upsertTaskDto } from "../dtos/taskDto";
import * as TaskService from '../service/taskService';
import { stat } from "fs";
import { update } from '../service/taskService';

const prisma = new PrismaClient();

describe('TaskService (Integration Tests)', () => {
    const getInsertTaskDto = (): upsertTaskDto => ({
        userId: 1,
        title: "test title",
        description: "test description",
        status: "To Do",
        priority: "High",
        start_date: new Date(),
        due_date: new Date(),
        notify_at: new Date()
    })
        
    const getUpdateTaskDto = (): upsertTaskDto => ({
        userId: 1,
        title: "updated title",
        description: "updated description",
        status: "In Progress",
        priority: "Medium",
        start_date: new Date(),
        due_date: new Date(),
        notify_at: new Date()
    })

    let insertedTask: Task;

    beforeEach(async ()=> {
        await prisma.task.deleteMany();
        insertedTask = await prisma.task.create({
            data: {
                user_id: 1,
                title: "test title",
                description: "test description",
                status: "In Progress",
                priority: "High",
                start_date: new Date(),
                due_date: new Date(),
                notify_at: new Date(),
                is_deleted: false
            }
        });
    });

    afterAll(async () => {
        await prisma.task.deleteMany();
        await prisma.$disconnect();
    });

    test('should insert task successfull', async ()=> {
        const dto = getInsertTaskDto();
        const result = await TaskService.insert(dto);

        expect(result).toMatchObject({
            title: dto.title,
            status: dto.status,
            priority: dto.priority,
            start_date: dto.start_date,
            due_date: dto.due_date,
            notify_at: dto.notify_at
        });

        expect(result.user_id).toBe(dto.userId);
    });

    test('should get task by ID successfully', async ()=> {
        const result = await TaskService.getByID(insertedTask.id, 1);

        expect(result).not.toBeNull();
        expect(result?.id).toBe(insertedTask.id);
        expect(result?.user_id).toBe(insertedTask.user_id);
        expect(result?.title).toBe(insertedTask.title);
    });

    test('should update task successfull', async ()=> {
        const dto = getUpdateTaskDto();
        const result = await TaskService.update(insertedTask.id, 1, dto);

        expect(result.title).toBe(dto.title);
        expect(result.status).toBe(dto.status);
        expect(result.priority).toBe(dto.priority);
    });

    test('should soft delete task successfully', async ()=> {
        const result = await TaskService.softDelete(insertedTask.id, 1);

        expect(result).toBe('Task deleted successfully');

        const deleted = await prisma.task.findUnique({ where: { id: insertedTask.id } });
        expect(deleted?.is_deleted).toBe(true);
    });

    test('should get paginated tasks successfully', async ()=> {
        const result = await TaskService.getByPaging(1, 10, 1, new Date().getFullYear(), new Date().getMonth() + 1);

        expect(result).not.toBeNull();
        expect(result?.results?.length).toBeGreaterThanOrEqual(1);
        expect(result?.results[0].user_id).toBe(1);
    })

    test('should hard delete task successfully', async ()=> {
        const result = await TaskService.hardDelete(insertedTask.id, 1);

        expect(result).toBe('Task deleted successfully');
    });

    test('should return null when no task found', async()=> {
        await prisma.task.deleteMany();

        const result = await TaskService.getByPaging(1, 10, 1, 2025, 1);

        expect(result.results).toEqual([]);
    })
});