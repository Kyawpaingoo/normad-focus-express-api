"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.MeetingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const ics_1 = require("ics");
let MeetingService = class MeetingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    insert(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.prisma.meetingSchedule.create({
                data: {
                    user_id: dto.user_id,
                    title: dto.title,
                    start_time: dto.start_time,
                    end_time: dto.end_time,
                    description: dto.description,
                    created_at: new Date(),
                    is_deleted: false,
                },
            });
            if (!result) {
                throw new common_1.BadRequestException('Meeting schedule creation failed');
            }
            return result;
        });
    }
    getById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.prisma.meetingSchedule.findFirst({
                where: {
                    id: id,
                    user_id: userId,
                    is_deleted: false,
                },
            });
            if (!result) {
                throw new common_1.NotFoundException('Meeting Schedule not found');
            }
            return result;
        });
    }
    generateICS(meeting) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!meeting) {
                throw new common_1.NotFoundException('Meeting not found');
            }
            const start = [
                meeting.start_time.getFullYear(),
                meeting.start_time.getMonth() + 1,
                meeting.start_time.getDate(),
                meeting.start_time.getHours(),
                meeting.start_time.getMinutes(),
            ];
            const end = [
                meeting.end_time.getFullYear(),
                meeting.end_time.getMonth() + 1,
                meeting.end_time.getDate(),
                meeting.end_time.getHours(),
                meeting.end_time.getMinutes(),
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
                    },
                }, (error, value) => {
                    if (error) {
                        reject(new common_1.BadRequestException('ICS generation failed: ' + error.message));
                    }
                    else {
                        resolve(value);
                    }
                });
            });
        });
    }
    update(id, user_id, meeting) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.prisma.meetingSchedule.update({
                where: {
                    id: id,
                    user_id: user_id,
                },
                data: Object.assign({}, meeting),
            });
            if (!result) {
                throw new common_1.BadRequestException('Failed to update Meeting Schedule');
            }
            return result;
        });
    }
    softDelete(id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.prisma.meetingSchedule.update({
                where: {
                    id: id,
                    user_id: user_id,
                },
                data: {
                    is_deleted: true,
                },
            });
            if (!result) {
                throw new common_1.BadRequestException('Meeting Schedule deletion failed');
            }
            return 'Meeting Schedule deleted successfully';
        });
    }
    hardDelete(id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.prisma.meetingSchedule.delete({
                where: {
                    id: id,
                    user_id: user_id,
                },
            });
            if (!result) {
                throw new common_1.BadRequestException('Meeting Schedule deletion failed');
            }
            return 'Meeting Schedule deleted successfully';
        });
    }
    getbyPaging(page, pageSize, userId, sortDir, q) {
        return __awaiter(this, void 0, void 0, function* () {
            const whereClause = Object.assign({ user_id: userId, is_deleted: false }, (q && {
                title: {
                    contains: q,
                    mode: 'insensitive',
                },
            }));
            const totalCount = yield this.prisma.meetingSchedule.count({
                where: whereClause,
            });
            const meetingSchedules = yield this.prisma.meetingSchedule.findMany({
                where: whereClause,
                orderBy: {
                    created_at: sortDir === 'asc' ? 'asc' : 'desc',
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
            });
            const totalPage = Math.ceil(totalCount / pageSize);
            if (!meetingSchedules || meetingSchedules.length === 0) {
                return {
                    totalCount: 0,
                    totalPage: 0,
                    results: [],
                    page,
                    pageSize,
                    hasNextPage: false,
                    hasPrevPage: false,
                };
            }
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
    }
};
exports.MeetingService = MeetingService;
exports.MeetingService = MeetingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MeetingService);
//# sourceMappingURL=meeting.service.js.map