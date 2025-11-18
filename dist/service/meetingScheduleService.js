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
exports.getbyPaging = exports.hardDelete = exports.softDelete = exports.update = exports.generateICS = exports.getById = exports.insert = void 0;
const ics_1 = require("ics");
const prisma_1 = __importDefault(require("../prisma"));
const insert = (dto) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.meetingSchedule.create({
        data: {
            user_id: dto.user_id,
            title: dto.title,
            start_time: dto.start_time,
            end_time: dto.end_time,
            description: dto.description,
            created_at: new Date(),
            is_deleted: false,
        }
    }));
    if (!result)
        throw new Error('Meeting schedule creation failed');
    return result;
});
exports.insert = insert;
const getById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.meetingSchedule.findFirst({
        where: {
            id: id,
            user_id: userId,
            is_deleted: false
        }
    }));
    if (!result)
        throw new Error('Meeting Schedule not found');
    return result;
});
exports.getById = getById;
const generateICS = (meeting) => __awaiter(void 0, void 0, void 0, function* () {
    if (!meeting)
        throw new Error('Meeting not found');
    const start = [
        meeting.start_time.getFullYear(),
        meeting.start_time.getMonth() + 1,
        meeting.start_time.getDate(),
        meeting.start_time.getHours(),
        meeting.start_time.getMinutes()
    ];
    const end = [
        meeting.end_time.getFullYear(),
        meeting.end_time.getMonth() + 1,
        meeting.end_time.getDate(),
        meeting.end_time.getHours(),
        meeting.end_time.getMinutes()
    ];
    const created = meeting.created_at
        ? [
            meeting.created_at.getFullYear(),
            meeting.created_at.getMonth() + 1,
            meeting.created_at.getDate(),
            meeting.created_at.getHours(),
            meeting.created_at.getMinutes(),
        ]
        : undefined;
    return new Promise((resolve, reject) => {
        var _a, _b;
        (0, ics_1.createEvent)({
            start,
            end,
            title: (_a = meeting.title) !== null && _a !== void 0 ? _a : 'meeting',
            description: (_b = meeting === null || meeting === void 0 ? void 0 : meeting.description) !== null && _b !== void 0 ? _b : '',
            location: 'Online',
            status: 'CONFIRMED',
            created,
            organizer: {
                name: 'Productivity Dashboard',
                email: 'no-reply@yourapp.com',
            }
        }, (error, value) => {
            if (error) {
                reject(new Error('ICS generation failed: ' + error.message));
            }
            else {
                resolve(value);
            }
        });
    });
});
exports.generateICS = generateICS;
const update = (id, user_id, meeting) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.meetingSchedule.update({
        where: {
            id: id,
            user_id: user_id
        },
        data: Object.assign({}, meeting)
    }));
    if (!result)
        throw new Error('Failed to update Meeting Schedule');
    return result;
});
exports.update = update;
const softDelete = (id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const reuslt = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.meetingSchedule.update({
        where: {
            id: id,
            user_id: user_id
        },
        data: {
            is_deleted: true
        }
    }));
    if (!reuslt)
        throw new Error('Meeting Schedule deletion failed');
    return "Meeting Schedule deleted successfully";
});
exports.softDelete = softDelete;
const hardDelete = (id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const reuslt = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.meetingSchedule.delete({
        where: {
            id: id,
            user_id: user_id
        }
    }));
    if (!reuslt)
        throw new Error('Meeting Schedule deletion failed');
    return "Meeting Schedule deleted successfully";
});
exports.hardDelete = hardDelete;
const getbyPaging = (page, pageSize, userId, sortDir, q) => __awaiter(void 0, void 0, void 0, function* () {
    const whereClause = Object.assign({ user_id: userId, is_deleted: false }, (q && {
        title: {
            constants: q,
            mode: 'insensitive'
        }
    }));
    const totalCount = yield prisma_1.default.meetingSchedule.count({
        where: whereClause
    });
    const meetingSchedules = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.meetingSchedule.findMany({
        where: whereClause,
        orderBy: {
            created_at: sortDir === 'asc' ? 'desc' : 'asc'
        },
        skip: (page - 1) * pageSize,
        take: pageSize
    }));
    const totalPage = Math.ceil(totalCount / pageSize);
    if (!meetingSchedules || meetingSchedules.length == 0)
        return {
            totalCount: 0,
            totalPage: 0,
            results: [],
            page,
            pageSize,
            hasNextPage: false,
            hasPrevPage: false
        };
    const result = {
        totalCount,
        totalPage,
        page,
        pageSize,
        hasNextPage: page < totalPage,
        hasPrevPage: page > 1,
        results: meetingSchedules,
    };
    return result;
});
exports.getbyPaging = getbyPaging;
//# sourceMappingURL=meetingScheduleService.js.map