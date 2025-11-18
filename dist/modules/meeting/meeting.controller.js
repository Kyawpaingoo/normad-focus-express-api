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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.MeetingController = void 0;
const common_1 = require("@nestjs/common");
const meeting_service_1 = require("./meeting.service");
const upsert_meeting_dto_1 = require("./dto/upsert-meeting.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let MeetingController = class MeetingController {
    constructor(meetingService) {
        this.meetingService = meetingService;
    }
    insertMeetingSchedule(meetingDto, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.meetingService.insert(meetingDto);
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: result,
                    msg: 'Meeting Schedule inserted successfully',
                });
            }
            catch (error) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    success: false,
                    error: error.message,
                    status: common_1.HttpStatus.BAD_REQUEST,
                });
            }
        });
    }
    getByID(id, userId, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.meetingService.getById(id, userId);
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: result,
                    msg: 'Meeting details fetched successfully',
                });
            }
            catch (error) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    success: false,
                    error: error.message,
                    status: common_1.HttpStatus.BAD_REQUEST,
                });
            }
        });
    }
    generateICSContent(id, userId, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const meeting = yield this.meetingService.getById(id, userId);
                const icsContent = yield this.meetingService.generateICS(meeting);
                res.setHeader('Content-Type', 'text/calendar');
                res.setHeader('Content-Disposition', `attachment; filename="meeting-${meeting.id}.ics"`);
                return res.status(common_1.HttpStatus.OK).send(icsContent);
            }
            catch (error) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    success: false,
                    error: error.message,
                    status: common_1.HttpStatus.BAD_REQUEST,
                });
            }
        });
    }
    updateMeetingSchedule(id, userId, meetingDto, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.meetingService.update(id, userId, meetingDto);
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: result,
                    msg: 'Meeting Schedule updated successfully',
                });
            }
            catch (error) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    success: false,
                    error: error.message,
                    status: common_1.HttpStatus.BAD_REQUEST,
                });
            }
        });
    }
    getByPaging(query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, pageSize, userId, sortDir, q } = query;
                const result = yield this.meetingService.getbyPaging(parseInt(page), parseInt(pageSize), parseInt(userId), sortDir, q);
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: result,
                    msg: 'Meeting Schedule Paging fetched successfully',
                });
            }
            catch (error) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    success: false,
                    error: error.message,
                    status: common_1.HttpStatus.BAD_REQUEST,
                });
            }
        });
    }
    softDeleteMeetingSchedule(id, userId, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.meetingService.softDelete(id, userId);
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: result,
                    msg: 'Meeting Schedule deleted successfully',
                });
            }
            catch (error) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    success: false,
                    error: error.message,
                    status: common_1.HttpStatus.BAD_REQUEST,
                });
            }
        });
    }
    hardDeleteMeetingSchedule(id, userId, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.meetingService.hardDelete(id, userId);
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: result,
                    msg: 'Meeting Schedule deleted successfully',
                });
            }
            catch (error) {
                return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                    success: false,
                    error: error.message,
                    status: common_1.HttpStatus.BAD_REQUEST,
                });
            }
        });
    }
};
exports.MeetingController = MeetingController;
__decorate([
    (0, common_1.Post)('insert'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upsert_meeting_dto_1.UpsertMeetingDto, Object]),
    __metadata("design:returntype", Promise)
], MeetingController.prototype, "insertMeetingSchedule", null);
__decorate([
    (0, common_1.Get)('get-by-id/:id/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], MeetingController.prototype, "getByID", null);
__decorate([
    (0, common_1.Get)('generate-ics-content/:id/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], MeetingController.prototype, "generateICSContent", null);
__decorate([
    (0, common_1.Put)('update/:id/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, upsert_meeting_dto_1.UpsertMeetingDto, Object]),
    __metadata("design:returntype", Promise)
], MeetingController.prototype, "updateMeetingSchedule", null);
__decorate([
    (0, common_1.Get)('get-by-paging'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MeetingController.prototype, "getByPaging", null);
__decorate([
    (0, common_1.Patch)('soft-delete/:id/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], MeetingController.prototype, "softDeleteMeetingSchedule", null);
__decorate([
    (0, common_1.Delete)('hard-delete/:id/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], MeetingController.prototype, "hardDeleteMeetingSchedule", null);
exports.MeetingController = MeetingController = __decorate([
    (0, common_1.Controller)('api/meeting-schedule'),
    __metadata("design:paramtypes", [meeting_service_1.MeetingService])
], MeetingController);
//# sourceMappingURL=meeting.controller.js.map