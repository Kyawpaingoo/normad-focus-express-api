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
const ExpenseService = __importStar(require("../service/expenseTrackerService"));
const responseDto_1 = require("../dtos/responseDto");
const prisma = new client_1.PrismaClient();
describe('ExpenseService (Integration Tests)', () => {
    const getInsertExpenseDto = () => ({
        user_id: 1,
        title: 'Test Expense',
        amount: 100.00,
        category: 'Food',
        currency: 'USD',
        type: 'Expense',
        expense_date: new Date(),
        note: 'Test note',
    });
    const getUpdateExpenseDto = () => ({
        user_id: 1,
        title: 'Updated Expense',
        amount: 200.00,
        category: 'Food',
        currency: 'USD',
        type: 'Expense',
        expense_date: new Date(),
        note: 'Updated note',
    });
    let insertedExpense;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.expense.deleteMany();
        insertedExpense = yield prisma.expense.create({
            data: {
                user_id: 1,
                title: 'Test Expense',
                amount: new client_1.Prisma.Decimal(100.00),
                category: 'Food',
                currency: 'USD',
                expense_date: new Date(),
                note: 'Test note',
                is_deleted: false,
            },
        });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.expense.deleteMany();
        yield prisma.$disconnect();
    }));
    test('should insert expense successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const dto = getInsertExpenseDto();
        const result = yield ExpenseService.insert(dto);
        expect(result).toMatchObject({
            title: dto.title,
            amount: new client_1.Prisma.Decimal(dto.amount),
            category: dto.category,
            currency: dto.currency,
            note: dto.note,
        });
        expect(result.user_id).toBe(dto.user_id);
    }));
    test('should get expense by ID successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield ExpenseService.getExpenseByID(insertedExpense.id, 1);
        expect(result).not.toBeNull();
        expect(result === null || result === void 0 ? void 0 : result.id).toBe(insertedExpense.id);
        expect(result === null || result === void 0 ? void 0 : result.title).toBe(insertedExpense.title);
    }));
    test('should update expense successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const dto = getUpdateExpenseDto();
        const result = yield ExpenseService.updateExpense(insertedExpense.id, 1, dto);
        expect(result.title).toBe(dto.title);
        expect((_a = result.amount) === null || _a === void 0 ? void 0 : _a.toString()).toBe(dto.amount.toString());
        expect(result.note).toBe(dto.note);
    }));
    test('should soft delete expense successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield ExpenseService.softDeleteExpense(insertedExpense.id, 1);
        expect(result).toBe(responseDto_1.dataResponseDto.Success);
        const deleted = yield prisma.expense.findUnique({ where: { id: insertedExpense.id } });
        expect(deleted === null || deleted === void 0 ? void 0 : deleted.is_deleted).toBe(true);
    }));
    test('should get paginated expenses successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const result = yield ExpenseService.getByPaging(1, 10, 1, new Date().getFullYear(), new Date().getMonth() + 1);
        expect(result).not.toBeNull();
        expect((_a = result === null || result === void 0 ? void 0 : result.results) === null || _a === void 0 ? void 0 : _a.length).toBeGreaterThanOrEqual(1);
        expect(result === null || result === void 0 ? void 0 : result.results[0].user_id).toBe(1);
    }));
    test('should hard delete expense successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield ExpenseService.hardDeleteExpense(insertedExpense.id, 1);
        expect(result).toBe(responseDto_1.dataResponseDto.Success);
        const deleted = yield prisma.expense.findUnique({ where: { id: insertedExpense.id } });
        expect(deleted).toBeNull();
    }));
    test('should return null when no expenses found', () => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.expense.deleteMany();
        const result = yield ExpenseService.getByPaging(1, 10, 1, 2025, 1);
        expect(result.results).toEqual([]);
    }));
});
//# sourceMappingURL=expense.service.test.js.map