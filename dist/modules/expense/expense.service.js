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
exports.ExpenseService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let ExpenseService = class ExpenseService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    insert(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.prisma.expense.create({
                data: Object.assign(Object.assign({}, data), { is_deleted: false }),
            });
            if (!result) {
                throw new common_1.BadRequestException('Expense insertion failed');
            }
            return result;
        });
    }
    getExpenseByID(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.prisma.expense.findFirst({
                where: {
                    id: id,
                    user_id: userId,
                    is_deleted: false,
                },
            });
            if (!result) {
                throw new common_1.NotFoundException('Expense not found');
            }
            return result;
        });
    }
    updateExpense(id, userId, expense) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.prisma.expense.update({
                where: {
                    id: id,
                    user_id: userId,
                },
                data: Object.assign({}, expense),
            });
            if (!result) {
                throw new common_1.BadRequestException('Expense update failed');
            }
            return result;
        });
    }
    softDeleteExpense(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.prisma.expense.update({
                where: {
                    id: id,
                    user_id: userId,
                },
                data: {
                    is_deleted: true,
                },
            });
            if (!result) {
                throw new common_1.BadRequestException('Expense deletion failed');
            }
            return 'Expense deleted successfully';
        });
    }
    hardDeleteExpense(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.prisma.expense.delete({
                where: {
                    id: id,
                    user_id: userId,
                },
            });
            if (!result) {
                throw new common_1.BadRequestException('Expense deletion failed');
            }
            return 'Expense deleted successfully';
        });
    }
    getByPaging(page_1, pageSize_1, userId_1, year_1, month_1) {
        return __awaiter(this, arguments, void 0, function* (page, pageSize, userId, year, month, sortDir = 'desc', q, category, type) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59);
            const whereClause = Object.assign(Object.assign(Object.assign({ user_id: userId, is_deleted: false, expense_date: {
                    gte: startDate,
                    lte: endDate,
                } }, (q && {
                title: {
                    contains: q,
                    mode: 'insensitive',
                },
            })), (category && { category })), (type && { type }));
            const totalCount = yield this.prisma.expense.count({
                where: whereClause,
            });
            const expenses = yield this.prisma.expense.findMany({
                where: whereClause,
                orderBy: {
                    expense_date: sortDir === 'asc' ? 'asc' : 'desc',
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
            });
            const totalPage = Math.ceil(totalCount / pageSize);
            if (!expenses || expenses.length === 0) {
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
            const expenseBreakdown = yield this.generateExpenseBreakdown(userId, year, month);
            const incomeVsExpense = yield this.generateIncomeVsExpense(userId, year, month);
            const additionalData = {
                expenseBreakdown,
                incomeVsExpense,
            };
            const result = {
                totalCount,
                totalPage,
                page,
                pageSize,
                hasNextPage: page < totalPage,
                hasPrevPage: page > 1,
                results: expenses,
                additionalData: JSON.stringify(additionalData),
            };
            return result;
        });
    }
    generateExpenseBreakdown(userId, year, month) {
        return __awaiter(this, void 0, void 0, function* () {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59);
            const prevMonth = month === 1 ? 12 : month - 1;
            const prevYear = month === 1 ? year - 1 : year;
            const prevStartDate = new Date(prevYear, prevMonth - 1, 1);
            const prevEndDate = new Date(prevYear, prevMonth, 0, 23, 59, 59);
            const currentExpenses = yield this.prisma.expense.groupBy({
                by: ['category'],
                where: {
                    user_id: userId,
                    is_deleted: false,
                    expense_date: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                _sum: {
                    amount: true,
                },
            });
            const prevExpenses = yield this.prisma.expense.groupBy({
                by: ['category'],
                where: {
                    user_id: userId,
                    is_deleted: false,
                    expense_date: {
                        gte: prevStartDate,
                        lte: prevEndDate,
                    },
                },
                _sum: {
                    amount: true,
                },
            });
            const currentTotal = currentExpenses.reduce((sum, item) => sum + Number(item._sum.amount || 0), 0);
            const prevTotal = prevExpenses.reduce((sum, item) => sum + Number(item._sum.amount || 0), 0);
            const change = prevTotal > 0 ? Math.round(((currentTotal - prevTotal) / prevTotal) * 100) : 0;
            const categories = currentExpenses.map((item) => ({
                label: item.category,
                value: Number(item._sum.amount || 0),
            }));
            return {
                total: currentTotal,
                change,
                categories,
            };
        });
    }
    generateIncomeVsExpense(userId, year, currentMonth) {
        return __awaiter(this, void 0, void 0, function* () {
            const values = [];
            const monthLabels = [];
            for (let month = 1; month <= currentMonth; month++) {
                const startDate = new Date(year, month - 1, 1);
                const endDate = new Date(year, month, 0, 23, 59, 59);
                const expenseResult = (yield this.prisma.expense.aggregate({
                    where: {
                        user_id: userId,
                        is_deleted: false,
                        type: 'expense',
                        expense_date: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                    _sum: {
                        amount: true,
                    },
                })) || { _sum: { amount: 0 } };
                const incomeResult = (yield this.prisma.expense.aggregate({
                    where: {
                        user_id: userId,
                        is_deleted: false,
                        type: 'income',
                        expense_date: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                    _sum: {
                        amount: true,
                    },
                })) || { _sum: { amount: 0 } };
                const expense = Number(expenseResult._sum.amount || 0);
                const income = Number(incomeResult._sum.amount || 0);
                const netAmount = income - expense;
                values.push(netAmount);
                monthLabels.push(months[month - 1]);
            }
            const currentValue = values[values.length - 1] || 0;
            const previousValue = values[values.length - 2] || 0;
            const change = previousValue > 0 ? Math.round(((currentValue - previousValue) / previousValue) * 100) : 0;
            return {
                total: currentValue,
                change,
                months: monthLabels,
                values,
            };
        });
    }
};
exports.ExpenseService = ExpenseService;
exports.ExpenseService = ExpenseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpenseService);
//# sourceMappingURL=expense.service.js.map