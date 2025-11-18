"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskForKanban = exports.getTaskForInfiniteScroll = exports.getTasksByView = exports.hardDelete = exports.softDelete = exports.update = exports.getByID = exports.insert = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const insert = (task) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.task.create({
        data: {
            title: task.title || null,
            description: task.description || null,
            status: task.status || 'To Do',
            priority: task.priority || 'Low',
            start_date: task.start_date || null,
            due_date: task.due_date || null,
            notify_at: task.notify_at || null,
            is_deleted: false,
            user_id: task.userId
        }
    });
    if (!result)
        throw new Error("Task insertion failed");
    return result;
});
exports.insert = insert;
const getByID = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.task.findFirst({
        where: {
            id: id,
            user_id: userId,
            is_deleted: false
        }
    }));
    if (!result)
        throw new Error("Task not found");
    return result;
});
exports.getByID = getByID;
const update = (id, userId, task) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.task.update({
        where: {
            id: id,
            user_id: userId
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
            user_id: task.userId
        }
    }));
    if (!result)
        throw new Error("Task update failed");
    return result;
});
exports.update = update;
const softDelete = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.task.update({
        where: {
            id: id,
            user_id: userId
        },
        data: {
            is_deleted: true
        }
    }));
    if (!result)
        throw new Error("Task deletion failed");
    return "Task deleted successfully";
});
exports.softDelete = softDelete;
const hardDelete = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.task.delete({
        where: {
            id: id,
            user_id: userId
        }
    }));
    if (!result)
        throw new Error("Task deletion failed");
    return "Task deleted successfully";
});
exports.hardDelete = hardDelete;
const getTasksByView = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (viewMode = 'board', cursor, limit, userId, year, month, sortDir = 'desc', q, status, priority) {
    if (viewMode === 'board') {
        return yield (0, exports.getTaskForKanban)(userId, year, month, sortDir, q, status, priority);
    }
    else {
        return yield (0, exports.getTaskForInfiniteScroll)(cursor, limit, userId, year, month, sortDir, q, status, priority);
    }
});
exports.getTasksByView = getTasksByView;
const getTaskForInfiniteScroll = (cursor_1, limit_1, userId_1, year_1, month_1, ...args_1) => __awaiter(void 0, [cursor_1, limit_1, userId_1, year_1, month_1, ...args_1], void 0, function* (cursor, limit, userId, year, month, sortDir = 'desc', q, status, priority) {
    var _a;
    const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    const baseWhereClause = Object.assign(Object.assign(Object.assign({ user_id: userId, is_deleted: false, start_date: {
            gte: startDate,
            lte: endDate
        } }, (q && {
        title: {
            contains: q,
            mode: 'insensitive'
        }
    })), (status && { status })), (priority && { priority }));
    const totalCount = yield prisma_1.default.task.count({
        where: baseWhereClause
    });
    const whereClause = Object.assign(Object.assign({}, baseWhereClause), (cursor && {
        OR: [
            {
                start_date: sortDir === 'desc' ? { lt: new Date(cursor.split('_')[0]) } : { gt: new Date(cursor.split('_')[0]) }
            },
            {
                start_date: new Date(cursor.split('_')[0]),
                id: sortDir === 'desc' ? { lt: parseInt(cursor.split('_')[1]) } : { gt: parseInt(cursor.split('_')[1]) }
            }
        ]
    }));
    const tasks = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.task.findMany({
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
    }));
    if (!tasks || tasks.length === 0) {
        return {
            results: [],
            nextCursor: null,
            hasNextPage: false,
            totalCount: totalCount || 0
        };
    }
    const hasNextPage = tasks.length > limit;
    const results = hasNextPage ? tasks.slice(0, limit) : tasks;
    if (!results || results.length === 0)
        return {
            results: [],
            nextCursor: null,
            hasNextPage: false,
            totalCount: totalCount || 0
        };
    const lastResult = results[results.length - 1];
    if (!lastResult)
        return {
            results: [],
            nextCursor: null,
            hasNextPage: false,
            totalCount: totalCount || 0
        };
    const nextCursor = hasNextPage && results.length > 0
        ? `${(_a = lastResult.start_date) === null || _a === void 0 ? void 0 : _a.toISOString()}_${lastResult.id}`
        : null;
    return Object.assign({ results,
        nextCursor,
        hasNextPage }, (totalCount !== undefined && { totalCount }));
});
exports.getTaskForInfiniteScroll = getTaskForInfiniteScroll;
const getTaskForKanban = (userId_1, year_1, month_1, ...args_1) => __awaiter(void 0, [userId_1, year_1, month_1, ...args_1], void 0, function* (userId, year, month, sortDir = 'desc', q, status, priority) {
    const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    const whereClause = Object.assign(Object.assign(Object.assign({ user_id: userId, is_deleted: false, start_date: {
            gte: startDate,
            lte: endDate
        } }, (q && {
        title: {
            contains: q,
            mode: 'insensitive'
        }
    })), (status && { status })), (priority && { priority }));
    const tasks = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.task.findMany({
        where: whereClause,
        orderBy: [
            {
                start_date: sortDir
            },
            {
                id: sortDir
            }
        ]
    }));
    if (!tasks || tasks.length === 0) {
        return {
            columns: {},
            totalCount: 0,
        };
    }
    const taskByStatus = tasks.reduce((acc, task) => {
        const status = task.status || 'to do';
        if (!acc[status]) {
            acc[status] = [];
        }
        acc[status].push(task);
        return acc;
    }, {});
    const columnConfig = {
        todo: { title: 'To Do', order: 1 },
        in_progress: { title: 'In Progress', order: 2 },
        done: { title: 'Done', order: 3 }
    };
    const columns = Object.entries(columnConfig).reduce((acc, [statusKey, config]) => {
        const items = taskByStatus[config.title] || [];
        acc[statusKey] = {
            title: config.title,
            items,
            totalCount: items.length
        };
        return acc;
    }, {});
    return {
        columns,
        totalCount: tasks.length,
    };
});
exports.getTaskForKanban = getTaskForKanban;
//# sourceMappingURL=taskService.js.map