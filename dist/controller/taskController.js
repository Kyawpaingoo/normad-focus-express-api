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
exports.hardDeleteTask = exports.softDeleteTask = exports.getByView = exports.updateTask = exports.getTaskByID = exports.createTask = void 0;
const taskService = __importStar(require("../service/taskService"));
const jsonResponse_1 = require("../utils/jsonResponse");
const notificationService = __importStar(require("../service/notificationService"));
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield taskService.insert(req.body);
        if (result.notify_at != null) {
            const notificationDto = {
                user_id: result.user_id,
                source_type: "Task",
                source_id: result.id,
                title: result.title,
                message: `Reminder: You have a task called ${result.title} to do at ${result.start_date}`,
                notify_at: result.notify_at
            };
            yield notificationService.insert(notificationDto);
        }
        (0, jsonResponse_1.successResponse)(res, result, "Task created successfully");
    }
    catch (error) {
        (0, jsonResponse_1.errorResponse)(error, 400, error.message, res);
    }
});
exports.createTask = createTask;
const getTaskByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, userId } = req.params;
        const result = yield taskService.getByID(parseInt(id), parseInt(userId));
        (0, jsonResponse_1.successResponse)(res, result, "Task details fetched successfully");
    }
    catch (error) {
        (0, jsonResponse_1.errorResponse)(error, 400, error.message, res);
    }
});
exports.getTaskByID = getTaskByID;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, userId } = req.params;
        const result = yield taskService.update(parseInt(id), parseInt(userId), req.body);
        if (result != null) {
            yield notificationService.update(result.id, result.notify_at);
        }
        (0, jsonResponse_1.successResponse)(res, result, "Task updated successfully");
    }
    catch (error) {
        (0, jsonResponse_1.errorResponse)(error, 400, error.message, res);
    }
});
exports.updateTask = updateTask;
const getByView = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { viewMode = 'list', cursor, limit = '20', userId, year, month, sortDir, q, status, priority, } = req.query;
        const limitNum = parseInt(limit);
        if (limitNum > 100) {
            return (0, jsonResponse_1.errorResponse)(new Error('Limit too large'), 400, 'Limit cannot exceed 100 items', res);
        }
        const view = viewMode;
        const result = yield taskService.getTasksByView(view, cursor || null, limitNum, parseInt(userId), parseInt(year), parseInt(month), sortDir, q, status, priority);
        (0, jsonResponse_1.successResponse)(res, result, `Tasks fetched successfully for ${view} view`);
    }
    catch (error) {
        (0, jsonResponse_1.errorResponse)(error, 400, error.message, res);
    }
});
exports.getByView = getByView;
const softDeleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, userId } = req.params;
        const result = yield taskService.softDelete(parseInt(id), parseInt(userId));
        (0, jsonResponse_1.successResponse)(res, result, "Task deleted successfully");
    }
    catch (error) {
        (0, jsonResponse_1.errorResponse)(error, 400, error.message, res);
    }
});
exports.softDeleteTask = softDeleteTask;
const hardDeleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, userId } = req.params;
        const result = yield taskService.hardDelete(parseInt(id), parseInt(userId));
        (0, jsonResponse_1.successResponse)(res, result, "Task deleted successfully");
    }
    catch (error) {
        (0, jsonResponse_1.errorResponse)(error, 400, error.message, res);
    }
});
exports.hardDeleteTask = hardDeleteTask;
//# sourceMappingURL=taskController.js.map