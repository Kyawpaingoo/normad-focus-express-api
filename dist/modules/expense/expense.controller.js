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
exports.ExpenseController = void 0;
const common_1 = require("@nestjs/common");
const expense_service_1 = require("./expense.service");
const upsert_expense_dto_1 = require("./dto/upsert-expense.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ExpenseController = class ExpenseController {
    constructor(expenseService) {
        this.expenseService = expenseService;
    }
    insertExpense(expenseDto, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.expenseService.insert(expenseDto);
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: result,
                    msg: 'Expense inserted successfully',
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
                const result = yield this.expenseService.getExpenseByID(id, userId);
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: result,
                    msg: 'Expense details fetched successfully',
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
    updateExpense(id, userId, expenseDto, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.expenseService.updateExpense(id, userId, expenseDto);
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: result,
                    msg: 'Expense updated successfully',
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
                const { page, pageSize, userId, year, month, sortDir, q, category, type } = query;
                const result = yield this.expenseService.getByPaging(parseInt(page), parseInt(pageSize), parseInt(userId), parseInt(year), parseInt(month), sortDir, q, category, type);
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: result,
                    msg: 'Expense Paging fetched successfully',
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
    softDeleteExpense(id, userId, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.expenseService.softDeleteExpense(id, userId);
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: result,
                    msg: 'Expense deleted successfully',
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
    hardDeleteExpense(id, userId, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.expenseService.hardDeleteExpense(id, userId);
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: result,
                    msg: 'Expense deleted successfully',
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
exports.ExpenseController = ExpenseController;
__decorate([
    (0, common_1.Post)('insert'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upsert_expense_dto_1.UpsertExpenseDto, Object]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "insertExpense", null);
__decorate([
    (0, common_1.Get)('get-by-id/:id/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "getByID", null);
__decorate([
    (0, common_1.Put)('update/:id/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, upsert_expense_dto_1.UpsertExpenseDto, Object]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "updateExpense", null);
__decorate([
    (0, common_1.Get)('get-by-paging'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "getByPaging", null);
__decorate([
    (0, common_1.Patch)('soft-delete/:id/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "softDeleteExpense", null);
__decorate([
    (0, common_1.Delete)('hard-delete/:id/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], ExpenseController.prototype, "hardDeleteExpense", null);
exports.ExpenseController = ExpenseController = __decorate([
    (0, common_1.Controller)('api/expense'),
    __metadata("design:paramtypes", [expense_service_1.ExpenseService])
], ExpenseController);
//# sourceMappingURL=expense.controller.js.map