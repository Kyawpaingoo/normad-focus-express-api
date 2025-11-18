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
const MeetingService = __importStar(require("../service/meetingScheduleService"));
const prisma = new client_1.PrismaClient();
describe('MeetingScheduleService (Integration Tests)', () => {
    const getInsertDto = () => ({
        user_id: 1,
        title: 'Test Meeting',
        description: 'Test Description',
        start_time: new Date('2025-08-01T10:00:00'),
        end_time: new Date('2025-08-01T11:00:00'),
    });
    const getUpdateDto = () => ({
        user_id: 1,
        title: 'Updated Meeting',
        description: 'Updated Description',
        start_time: new Date('2025-08-01T12:00:00'),
        end_time: new Date('2025-08-01T13:00:00'),
    });
    let insertedMeeting;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.meetingSchedule.deleteMany();
        insertedMeeting = yield prisma.meetingSchedule.create({
            data: {
                user_id: 1,
                title: 'Test Meeting',
                description: 'Test Description',
                start_time: new Date('2025-08-01T10:00:00'),
                end_time: new Date('2025-08-01T11:00:00'),
                created_at: new Date(),
                is_deleted: false,
            },
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.meetingSchedule.deleteMany();
        yield prisma.$disconnect();
    }));
    test('should insert meeting schedule successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const dto = getInsertDto();
        const result = yield MeetingService.insert(dto);
        expect(result).toMatchObject({
            title: dto.title,
            description: dto.description,
        });
        expect(result.user_id).toBe(dto.user_id);
    }));
    test('should get meeting by id and user_id', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield MeetingService.getById(insertedMeeting.id, 1);
        expect(result.id).toBe(insertedMeeting.id);
        expect(result.title).toBe(insertedMeeting.title);
    }));
    test('should update meeting schedule successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const dto = getUpdateDto();
        const result = yield MeetingService.update(insertedMeeting.id, 1, dto);
        expect(result.title).toBe(dto.title);
        expect(result.description).toBe(dto.description);
    }));
    test('should generate ICS string', () => __awaiter(void 0, void 0, void 0, function* () {
        const ics = yield MeetingService.generateICS(insertedMeeting);
        expect(typeof ics).toBe('string');
        expect(ics).toContain('BEGIN:VCALENDAR');
        expect(ics).toContain(`SUMMARY:${insertedMeeting.title}`);
    }));
    test('should soft delete meeting', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield MeetingService.softDelete(insertedMeeting.id, 1);
        expect(result).toBe('Meeting Schedule deleted successfully');
        const check = yield prisma.meetingSchedule.findUnique({ where: { id: insertedMeeting.id } });
        expect(check === null || check === void 0 ? void 0 : check.is_deleted).toBe(true);
    }));
    test('should hard delete meeting', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield MeetingService.hardDelete(insertedMeeting.id, 1);
        expect(result).toBe('Meeting Schedule deleted successfully');
        const check = yield prisma.meetingSchedule.findUnique({ where: { id: insertedMeeting.id } });
        expect(check).toBeNull();
    }));
    test('should return paginated meeting schedules', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield MeetingService.getbyPaging(1, 10, 1, 'asc');
        expect(result).toHaveProperty('results');
        expect(result.results.length).toBeGreaterThan(0);
        expect(result.results[0].user_id).toBe(1);
    }));
    test('should return empty results when no meeting schedules found', () => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.meetingSchedule.deleteMany();
        const result = yield MeetingService.getbyPaging(1, 10, 1, 'asc');
        expect(result.results).toEqual([]);
        expect(result.totalCount).toBe(0);
    }));
});
//# sourceMappingURL=meeting.service.test.js.map