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
exports.getByPaging = exports.hardDelete = exports.update = exports.getById = exports.insert = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const insert = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.countryLog.create({
        data: {
            user_id: data.user_id,
            country_name: data.country_name,
            visa_type: data.visa_type,
            visa_limit_days: data.visa_limit_days,
            entry_date: data.entry_date,
            exit_date: data.exit_date,
            notify_at: data.notify_at,
            created_at: new Date(),
        }
    }));
    if (!result)
        throw new Error('Country Log creation failed');
    return result;
});
exports.insert = insert;
const getById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.countryLog.findFirst({
        where: {
            id: id,
            user_id: userId
        }
    });
    if (!result)
        throw new Error('Country log not found');
    return result;
});
exports.getById = getById;
const update = (id, userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.countryLog.update({
        where: {
            id: id,
            user_id: userId
        },
        data: Object.assign({}, data)
    });
    if (!result)
        throw new Error('Failed to update Country Log');
    return result;
});
exports.update = update;
const hardDelete = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.countryLog.delete({
        where: {
            id: id,
            user_id: userId
        },
    });
    if (!result)
        throw new Error('Country Log deletion failed');
    return "Country Log deleted successfully";
});
exports.hardDelete = hardDelete;
const getByPaging = (page, pageSize, userId, sortDir, q) => __awaiter(void 0, void 0, void 0, function* () {
    const whereClause = Object.assign({ user_id: userId }, (q && {
        title: {
            constants: q,
            mode: 'insensitive'
        }
    }));
    const totalCount = yield prisma_1.default.countryLog.count({
        where: whereClause
    });
    const countryLogs = yield prisma_1.default.countryLog.findMany({
        where: whereClause,
        orderBy: {
            created_at: sortDir === 'asc' ? 'desc' : 'asc'
        },
        skip: (page - 1) * pageSize,
        take: pageSize
    });
    const totalPage = Math.ceil(totalCount / pageSize);
    if (!countryLogs || countryLogs.length == 0)
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
        results: countryLogs,
    };
    return result;
});
exports.getByPaging = getByPaging;
//# sourceMappingURL=countryLogService.js.map