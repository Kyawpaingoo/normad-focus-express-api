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
exports.hardDeleteExpense = exports.softDeleteExpense = exports.getByPaging = exports.updateExpense = exports.getByID = exports.insertExpense = void 0;
const expenseService = __importStar(require("../service/expenseTrackerService"));
const jsonResponse_1 = require("../utils/jsonResponse");
const insertExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield expenseService.insert(req.body);
        (0, jsonResponse_1.successResponse)(res, result, "Expense inserted successfully");
    }
    catch (error) {
        (0, jsonResponse_1.errorResponse)(error, 400, error.message, res);
    }
});
exports.insertExpense = insertExpense;
const getByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, userId } = req.params;
        const result = yield expenseService.getExpenseByID(parseInt(id), parseInt(userId));
        (0, jsonResponse_1.successResponse)(res, result, "Expense details fetched successfully");
    }
    catch (error) {
        (0, jsonResponse_1.errorResponse)(error, 400, error.message, res);
    }
});
exports.getByID = getByID;
const updateExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, userId } = req.params;
        const result = yield expenseService.updateExpense(parseInt(id), parseInt(userId), req.body);
        (0, jsonResponse_1.successResponse)(res, result, "Expense updated successfully");
    }
    catch (error) {
        (0, jsonResponse_1.errorResponse)(error, 400, error.message, res);
    }
});
exports.updateExpense = updateExpense;
const getByPaging = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, pageSize, userId, year, month, sortDir, q, category, type } = req.query;
        const result = yield expenseService.getByPaging(parseInt(page), parseInt(pageSize), parseInt(userId), parseInt(year), parseInt(month), sortDir, q, category, type);
        (0, jsonResponse_1.successResponse)(res, result, "Expense Paging fetched successfully");
    }
    catch (error) {
        (0, jsonResponse_1.errorResponse)(error, 400, error.message, res);
    }
});
exports.getByPaging = getByPaging;
const softDeleteExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, userId } = req.params;
        const result = yield expenseService.softDeleteExpense(parseInt(id), parseInt(userId));
        (0, jsonResponse_1.successResponse)(res, result, "Expense deleted successfully");
    }
    catch (error) {
        (0, jsonResponse_1.errorResponse)(error, 400, error.message, res);
    }
});
exports.softDeleteExpense = softDeleteExpense;
const hardDeleteExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, userId } = req.params;
        const result = yield expenseService.hardDeleteExpense(parseInt(id), parseInt(userId));
        (0, jsonResponse_1.successResponse)(res, result, "Expense deleted successfully");
    }
    catch (error) {
        (0, jsonResponse_1.errorResponse)(error, 400, error.message, res);
    }
});
exports.hardDeleteExpense = hardDeleteExpense;
//# sourceMappingURL=expenseTrackerController.js.map