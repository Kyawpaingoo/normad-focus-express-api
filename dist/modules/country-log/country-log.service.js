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
exports.CountryLogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let CountryLogService = class CountryLogService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.prisma.countryLog.create({
                data: {
                    user_id: data.user_id,
                    country_name: data.country_name,
                    visa_type: data.visa_type,
                    visa_limit_days: data.visa_limit_days,
                    entry_date: data.entry_date,
                    exit_date: data.exit_date,
                    notify_at: data.notify_at || null,
                    created_at: new Date(),
                },
            });
            if (!result) {
                throw new common_1.BadRequestException('Country Log creation failed');
            }
            return result;
        });
    }
    getById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.prisma.countryLog.findFirst({
                where: {
                    id: id,
                    user_id: userId,
                },
            });
            if (!result) {
                throw new common_1.NotFoundException('Country log not found');
            }
            return result;
        });
    }
    update(id, userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.prisma.countryLog.update({
                where: {
                    id: id,
                    user_id: userId,
                },
                data: Object.assign({}, data),
            });
            if (!result) {
                throw new common_1.BadRequestException('Failed to update Country Log');
            }
            return result;
        });
    }
    hardDelete(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.prisma.countryLog.delete({
                where: {
                    id: id,
                    user_id: userId,
                },
            });
            if (!result) {
                throw new common_1.BadRequestException('Country Log deletion failed');
            }
            return 'Country Log deleted successfully';
        });
    }
    getByPaging(page, pageSize, userId, sortDir, q) {
        return __awaiter(this, void 0, void 0, function* () {
            const whereClause = Object.assign({ user_id: userId }, (q && {
                country_name: {
                    contains: q,
                    mode: 'insensitive',
                },
            }));
            const totalCount = yield this.prisma.countryLog.count({
                where: whereClause,
            });
            const countryLogs = yield this.prisma.countryLog.findMany({
                where: whereClause,
                orderBy: {
                    created_at: sortDir === 'asc' ? 'asc' : 'desc',
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
            });
            const totalPage = Math.ceil(totalCount / pageSize);
            if (!countryLogs || countryLogs.length === 0) {
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
                results: countryLogs,
            };
            return result;
        });
    }
};
exports.CountryLogService = CountryLogService;
exports.CountryLogService = CountryLogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CountryLogService);
//# sourceMappingURL=country-log.service.js.map