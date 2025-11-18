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
const CountryLogService = __importStar(require("../service/countryLogService"));
const prisma = new client_1.PrismaClient();
describe('CountryLogService (Integration Tests)', () => {
    const getInsertDto = () => ({
        user_id: 1,
        country_name: 'Thailand',
        entry_date: new Date('2025-07-01'),
        visa_limit_days: 100,
        exit_date: new Date('2025-10-10'),
        visa_type: 'Education Visa',
        notify_at: new Date('2025-09-20')
    });
    const getUpdateDto = () => ({
        user_id: 1,
        country_name: 'Thailand',
        entry_date: new Date('2025-07-01'),
        visa_limit_days: 90,
        exit_date: new Date('2025-10-10'),
        visa_type: 'Education Visa',
        notify_at: new Date('2025-09-20')
    });
    let insertedLog;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.countryLog.deleteMany();
        insertedLog = yield prisma.countryLog.create({
            data: {
                user_id: 1,
                country_name: 'Thailand',
                entry_date: new Date('2025-07-01'),
                visa_limit_days: 100,
                exit_date: new Date('2025-10-10'),
                visa_type: 'Education Visa',
                notify_at: new Date('2025-09-20')
            },
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.countryLog.deleteMany();
        yield prisma.$disconnect();
    }));
    test('should insert country log successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const dto = getInsertDto();
        const result = yield CountryLogService.insert(dto);
        expect(result.user_id).toBe(insertedLog.user_id);
        expect(result.country_name).toBe(insertedLog.country_name);
    }));
    test('should get country log by ID successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield CountryLogService.getById(insertedLog.id, 1);
        expect(result.id).toBe(insertedLog.id);
        expect(result.user_id).toBe(insertedLog.user_id);
    }));
    test('should throw when country log not found', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(CountryLogService.getById(9999, 1)).rejects.toThrow('Country log not found');
    }));
    test('should update country log successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const dto = getUpdateDto();
        const result = yield CountryLogService.update(insertedLog.id, 1, dto);
        expect(result.country_name).toBe(dto.country_name);
        expect(result.visa_type).toBe(dto.visa_type);
    }));
    test('should hard delete country log successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield CountryLogService.hardDelete(insertedLog.id, 1);
        expect(result).toBe('Country Log deleted successfully');
        const deleted = yield prisma.countryLog.findUnique({
            where: { id: insertedLog.id },
        });
        expect(deleted).toBeNull();
    }));
    test('should return paginated country logs', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield CountryLogService.getByPaging(1, 10, 1, 'asc');
        expect(result.results.length).toBeGreaterThan(0);
        expect(result.page).toBe(1);
        expect(result.pageSize).toBe(10);
    }));
    test('should return empty results when no logs found', () => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.countryLog.deleteMany();
        const result = yield CountryLogService.getByPaging(1, 10, 1, 'asc');
        expect(result.results).toEqual([]);
        expect(result.totalCount).toBe(0);
    }));
});
//# sourceMappingURL=countryLog.service.test.js.map