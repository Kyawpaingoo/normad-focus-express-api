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
exports.TaskController = void 0;
const common_1 = require("@nestjs/common");
const task_service_1 = require("./task.service");
const notification_service_1 = require("../notification/notification.service");
const upsert_task_dto_1 = require("./dto/upsert-task.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TaskController = class TaskController {
    constructor(taskService, notificationService) {
        this.taskService = taskService;
        this.notificationService = notificationService;
    }
    createTask(taskDto, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.taskService.insert(taskDto);
                if (result.notify_at != null) {
                    const notificationDto = {
                        user_id: result.user_id,
                        source_type: 'Task',
                        source_id: result.id,
                        title: result.title,
                        message: `Reminder: You have a task called ${result.title} to do at ${result.start_date}`,
                        notify_at: result.notify_at,
                    };
                    yield this.notificationService.insert(notificationDto);
                }
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: result,
                    msg: 'Task created successfully',
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
    getTaskByID(id, userId, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.taskService.getByID(id, userId);
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: result,
                    msg: 'Task details fetched successfully',
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
    updateTask(id, userId, taskDto, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.taskService.update(id, userId, taskDto);
                if (result != null) {
                    yield this.notificationService.update(result.id, result.notify_at);
                }
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: result,
                    msg: 'Task updated successfully',
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
    getByView(query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { viewMode = 'list', cursor, limit = '20', userId, year, month, sortDir, q, status, priority, } = query;
                const limitNum = parseInt(limit);
                if (limitNum > 100) {
                    return res.status(common_1.HttpStatus.BAD_REQUEST).json({
                        success: false,
                        error: 'Limit cannot exceed 100 items',
                        status: common_1.HttpStatus.BAD_REQUEST,
                    });
                }
                const view = viewMode;
                const result = yield this.taskService.getTasksByView(view, cursor || null, limitNum, parseInt(userId), parseInt(year), parseInt(month), sortDir, q, status, priority);
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: result,
                    msg: `Tasks fetched successfully for ${view} view`,
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
    softDeleteTask(id, userId, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.taskService.softDelete(id, userId);
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: result,
                    msg: 'Task deleted successfully',
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
    hardDeleteTask(id, userId, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.taskService.hardDelete(id, userId);
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: result,
                    msg: 'Task deleted successfully',
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
exports.TaskController = TaskController;
__decorate([
    (0, common_1.Post)('insert'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upsert_task_dto_1.UpsertTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "createTask", null);
__decorate([
    (0, common_1.Get)('get-by-id/:id/:userId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getTaskByID", null);
__decorate([
    (0, common_1.Put)('update/:id/:userId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, upsert_task_dto_1.UpsertTaskDto, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "updateTask", null);
__decorate([
    (0, common_1.Get)('get-by-view'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "getByView", null);
__decorate([
    (0, common_1.Patch)('soft-delete/:id/:userId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "softDeleteTask", null);
__decorate([
    (0, common_1.Delete)('hard-delete/:id/:userId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "hardDeleteTask", null);
exports.TaskController = TaskController = __decorate([
    (0, common_1.Controller)('api/task'),
    __metadata("design:paramtypes", [task_service_1.TaskService,
        notification_service_1.NotificationService])
], TaskController);
//# sourceMappingURL=task.controller.js.map