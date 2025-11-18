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
exports.getByPaging = exports.hardDeleteExpense = exports.softDeleteExpense = exports.updateExpense = exports.getExpenseByID = exports.insert = void 0;
const responseDto_1 = require("../dtos/responseDto");
const prisma_1 = __importDefault(require("../prisma"));
const months_1 = require("../dtos/months");
const insert = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.expense.create({
        data: Object.assign(Object.assign({}, data), { is_deleted: false })
    }));
    if (!result)
        throw new Error("Expense insertion failed");
    return result;
});
exports.insert = insert;
const getExpenseByID = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.expense.findFirst({
        where: {
            id: id,
            user_id: userId,
            is_deleted: false
        }
    }));
    if (!result)
        throw new Error("Expense not found");
    return result;
});
exports.getExpenseByID = getExpenseByID;
const updateExpense = (id, userId, expense) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.expense.update({
        where: {
            id: id,
            user_id: userId
        },
        data: Object.assign({}, expense)
    }));
    if (!result)
        throw new Error("Expense update failed");
    return result;
});
exports.updateExpense = updateExpense;
const softDeleteExpense = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.expense.update({
        where: {
            id: id,
            user_id: userId
        },
        data: {
            is_deleted: true
        }
    }));
    if (!result)
        throw new Error("Expense deletion failed");
    return responseDto_1.dataResponseDto.Success;
});
exports.softDeleteExpense = softDeleteExpense;
const hardDeleteExpense = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.expense.delete({
        where: {
            id: id,
            user_id: userId
        }
    }));
    if (!result)
        throw new Error("Expense deletion failed");
    return responseDto_1.dataResponseDto.Success;
});
exports.hardDeleteExpense = hardDeleteExpense;
const getByPaging = (page_1, pageSize_1, userId_1, year_1, month_1, ...args_1) => __awaiter(void 0, [page_1, pageSize_1, userId_1, year_1, month_1, ...args_1], void 0, function* (page, pageSize, userId, year, month, sortDir = 'desc', q, category, type) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    const whereClause = Object.assign(Object.assign(Object.assign({ user_id: userId, is_deleted: false, expense_date: {
            gte: startDate,
            lte: endDate
        } }, (q && {
        title: {
            contains: q,
            mode: 'insensitive'
        }
    })), (category && { category })), (type && { type }));
    const totalCount = yield prisma_1.default.expense.count({
        where: whereClause
    });
    const expenses = yield prisma_1.default.expense.findMany({
        where: whereClause,
        orderBy: {
            expense_date: sortDir === 'asc' ? 'asc' : 'desc'
        },
        skip: (page - 1) * pageSize,
        take: pageSize
    });
    const totalPage = Math.ceil(totalCount / pageSize);
    if (!expenses || expenses.length === 0)
        return {
            totalCount: 0,
            totalPage: 0,
            results: [],
            page,
            pageSize,
            hasNextPage: false,
            hasPrevPage: false
        };
    const expenseBreakdown = yield generateExpenseBreakdown(userId, year, month);
    const incomeVsExpense = yield generateIncomeVsExpense(userId, year, month);
    const additionalData = {
        expenseBreakdown,
        incomeVsExpense
    };
    const result = {
        totalCount,
        totalPage,
        page,
        pageSize,
        hasNextPage: page < totalPage,
        hasPrevPage: page > 1,
        results: expenses,
        additionalData: JSON.stringify(additionalData)
    };
    return result;
});
exports.getByPaging = getByPaging;
const generateExpenseBreakdown = (userId, year, month) => __awaiter(void 0, void 0, void 0, function* () {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const prevStartDate = new Date(prevYear, prevMonth - 1, 1);
    const prevEndDate = new Date(prevYear, prevMonth, 0, 23, 59, 59);
    const currentExpenses = yield prisma_1.default.expense.groupBy({
        by: ['category'],
        where: {
            user_id: userId,
            is_deleted: false,
            expense_date: {
                gte: startDate,
                lte: endDate
            }
        },
        _sum: {
            amount: true
        }
    });
    const prevExpenses = yield prisma_1.default.expense.groupBy({
        by: ['category'],
        where: {
            user_id: userId,
            is_deleted: false,
            expense_date: {
                gte: prevStartDate,
                lte: prevEndDate
            }
        },
        _sum: {
            amount: true
        }
    });
    const currentTotal = currentExpenses.reduce((sum, item) => sum + Number(item._sum.amount || 0), 0);
    const prevTotal = prevExpenses.reduce((sum, item) => sum + Number(item._sum.amount || 0), 0);
    const change = prevTotal > 0 ? Math.round(((currentTotal - prevTotal) / prevTotal) * 100) : 0;
    const categories = currentExpenses.map(item => ({
        label: item.category,
        value: Number(item._sum.amount || 0)
    }));
    return {
        total: currentTotal,
        change,
        categories
    };
});
const generateIncomeVsExpense = (userId, year, currentMonth) => __awaiter(void 0, void 0, void 0, function* () {
    const values = [];
    const monthLabels = [];
    for (let month = 1; month <= currentMonth; month++) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        const expenseResult = (yield prisma_1.default.expense.aggregate({
            where: {
                user_id: userId,
                is_deleted: false,
                type: 'expense',
                expense_date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            _sum: {
                amount: true
            }
        })) || { _sum: { amount: 0 } };
        const incomeResult = (yield prisma_1.default.expense.aggregate({
            where: {
                user_id: userId,
                is_deleted: false,
                type: 'income',
                expense_date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            _sum: {
                amount: true
            }
        })) || { _sum: { amount: 0 } };
        const expense = Number(expenseResult._sum.amount || 0);
        const income = Number(incomeResult._sum.amount || 0);
        const netAmount = income - expense;
        values.push(netAmount);
        monthLabels.push(months_1.months[month - 1]);
        const currentValue = values[values.length - 1] || 0;
        const previousValue = values[values.length - 2] || 0;
        const change = currentValue > 0 ? Math.round(((currentValue - previousValue) / previousValue) * 100) : 0;
        return {
            total: currentValue,
            change,
            months: monthLabels,
            values
        };
    }
});
//# sourceMappingURL=expenseTrackerService.js.map