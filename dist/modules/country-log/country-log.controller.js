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
exports.CountryLogController = void 0;
const common_1 = require("@nestjs/common");
const country_log_service_1 = require("./country-log.service");
const notification_service_1 = require("../notification/notification.service");
const upsert_country_log_dto_1 = require("./dto/upsert-country-log.dto");
let CountryLogController = class CountryLogController {
    constructor(countryLogService, notificationService) {
        this.countryLogService = countryLogService;
        this.notificationService = notificationService;
    }
    createCountryLog(countryLogDto, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.countryLogService.insert(countryLogDto);
                if (result.notify_at != null) {
                    const notificationDto = {
                        user_id: result.user_id,
                        source_id: result.id,
                        source_type: 'Country Log',
                        title: 'Visa Expiry Alert',
                        message: `Reminder: Your ${result.visa_type} will be seen expired in ${result.exit_date}`,
                        notify_at: result.notify_at,
                    };
                    yield this.notificationService.insert(notificationDto);
                }
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: result,
                    msg: 'Country Log created successfully',
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
    getCountryLogById(id, userId, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.countryLogService.getById(id, userId);
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: result,
                    msg: 'Country log details fetch successfull',
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
    updateCountryLog(id, userId, countryLogDto, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.countryLogService.update(id, userId, countryLogDto);
                if (result != null) {
                    yield this.notificationService.update(result.id, result.notify_at);
                }
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: result,
                    msg: 'Country Log upadted Successfully',
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
    deleteCountryLog(id, userId, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.countryLogService.hardDelete(id, userId);
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: result,
                    msg: 'Country log deleted successfully',
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
                const result = yield this.countryLogService.getByPaging(parseInt(page), parseInt(pageSize), parseInt(userId), sortDir, q);
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: result,
                    msg: 'Country Log fetched successfully',
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
exports.CountryLogController = CountryLogController;
__decorate([
    (0, common_1.Post)('insert'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upsert_country_log_dto_1.UpsertCountryLogDto, Object]),
    __metadata("design:returntype", Promise)
], CountryLogController.prototype, "createCountryLog", null);
__decorate([
    (0, common_1.Get)('get-by-id/:id/:userId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], CountryLogController.prototype, "getCountryLogById", null);
__decorate([
    (0, common_1.Put)('update/:id/:userId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, upsert_country_log_dto_1.UpsertCountryLogDto, Object]),
    __metadata("design:returntype", Promise)
], CountryLogController.prototype, "updateCountryLog", null);
__decorate([
    (0, common_1.Delete)('hard-delete/:id/:userId'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], CountryLogController.prototype, "deleteCountryLog", null);
__decorate([
    (0, common_1.Get)('get-by-paging'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CountryLogController.prototype, "getByPaging", null);
exports.CountryLogController = CountryLogController = __decorate([
    (0, common_1.Controller)('api/country-log'),
    __metadata("design:paramtypes", [country_log_service_1.CountryLogService,
        notification_service_1.NotificationService])
], CountryLogController);
//# sourceMappingURL=country-log.controller.js.map