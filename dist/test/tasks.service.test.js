"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const TaskService = __importStar(require("../service/taskService"));
const prisma = new client_1.PrismaClient();
describe('TaskService (Integration Tests)', () => {
    const getInsertTaskDto = () => ({
        userId: 1,
        title: "test title",
        description: "test description",
        status: "To Do",
        priority: "High",
        start_date: new Date(),
        due_date: new Date(),
        notify_at: new Date()
    });
    const getUpdateTaskDto = () => ({
        userId: 1,
        title: "updated title",
        description: "updated description",
        status: "In Progress",
        priority: "Medium",
        start_date: new Date(),
        due_date: new Date(),
        notify_at: new Date()
    });
    let insertedTask;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.task.deleteMany();
        insertedTask = yield prisma.task.create({
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
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.task.deleteMany();
        yield prisma.$disconnect();
    }));
    test('should insert task successfull', () => __awaiter(void 0, void 0, void 0, function* () {
        const dto = getInsertTaskDto();
        const result = yield TaskService.insert(dto);
        expect(result).toMatchObject({
            title: dto.title,
            status: dto.status,
            priority: dto.priority,
            start_date: dto.start_date,
            due_date: dto.due_date,
            notify_at: dto.notify_at
        });
        expect(result.user_id).toBe(dto.userId);
    }));
    test('should get task by ID successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield TaskService.getByID(insertedTask.id, 1);
        expect(result).not.toBeNull();
        expect(result === null || result === void 0 ? void 0 : result.id).toBe(insertedTask.id);
        expect(result === null || result === void 0 ? void 0 : result.user_id).toBe(insertedTask.user_id);
        expect(result === null || result === void 0 ? void 0 : result.title).toBe(insertedTask.title);
    }));
    test('should update task successfull', () => __awaiter(void 0, void 0, void 0, function* () {
        const dto = getUpdateTaskDto();
        const result = yield TaskService.update(insertedTask.id, 1, dto);
        expect(result.title).toBe(dto.title);
        expect(result.status).toBe(dto.status);
        expect(result.priority).toBe(dto.priority);
    }));
    test('should get tasks for kanban view successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield TaskService.getTasksByView('board', null, 10, 1, new Date().getFullYear(), new Date().getMonth() + 1);
        expect(result).not.toBeNull();
        expect(result).toBeDefined();
        expect('columns' in result).toBe(true);
        const kanbanResult = result;
        expect(kanbanResult.totalCount).toBeGreaterThanOrEqual(0);
        expect((_a = kanbanResult.columns['in-progress']) === null || _a === void 0 ? void 0 : _a.items[0]).not.toBeNull();
    }));
    test('should get paginated tasks for infinite scroll view successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield TaskService.getTasksByView('list', null, 10, 1, new Date().getFullYear(), new Date().getMonth() + 1);
        expect(result).not.toBeNull();
        expect(result).toBeDefined();
        expect('results' in result).toBe(true);
        const listResult = result;
        expect(listResult.totalCount).toBeGreaterThanOrEqual(0);
    }));
    test('should soft delete task successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield TaskService.softDelete(insertedTask.id, 1);
        expect(result).toBe('Task deleted successfully');
        const deleted = yield prisma.task.findUnique({ where: { id: insertedTask.id } });
        expect(deleted === null || deleted === void 0 ? void 0 : deleted.is_deleted).toBe(true);
    }));
    test('should hard delete task successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield TaskService.hardDelete(insertedTask.id, 1);
        expect(result).toBe('Task deleted successfully');
    }));
    test('should return null when no task found in kanban view', () => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.task.deleteMany();
        const result = yield TaskService.getTasksByView('board', null, 10, 1, new Date().getFullYear(), new Date().getMonth() + 1);
        const kanbanResult = result;
        expect(kanbanResult.columns).toEqual({});
        expect(kanbanResult.totalCount).toBe(0);
    }));
    test('should return null when no task found in infinite scroll view', () => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.task.deleteMany();
        const result = yield TaskService.getTasksByView('list', null, 10, 1, new Date().getFullYear(), new Date().getMonth() + 1);
        const listResult = result;
        expect(listResult.results).toEqual([]);
        expect(listResult.totalCount).toBe(0);
    }));
});
//# sourceMappingURL=tasks.service.test.js.map