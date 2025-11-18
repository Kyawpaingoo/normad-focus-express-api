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
exports.getByPaging = exports.deleteCountryLog = exports.updateCountryLog = exports.getCountryLogById = exports.createCountryLog = void 0;
const CountryLogService = __importStar(require("../service/countryLogService"));
const notificationService = __importStar(require("../service/notificationService"));
const jsonResponse_1 = require("../utils/jsonResponse");
const createCountryLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield CountryLogService.insert(req.body);
        if (result.notify_at != null) {
            const notificationDto = {
                user_id: result.user_id,
                source_id: result.id,
                source_type: 'Country Log',
                title: 'Visa Expiry Alert',
                message: `Reminder: Your ${result.visa_type} will be seen expired in ${result.exit_date}`,
                notify_at: result.notify_at
            };
            yield notificationService.insert(notificationDto);
        }
        (0, jsonResponse_1.successResponse)(res, result, 'Country Log created successfully');
    }
    catch (err) {
        (0, jsonResponse_1.errorResponse)(err, 400, err.message, res);
    }
});
exports.createCountryLog = createCountryLog;
const getCountryLogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, userId } = req.params;
        const result = yield CountryLogService.getById(parseInt(id), parseInt(userId));
        (0, jsonResponse_1.successResponse)(res, result, 'Country log details fetch successfull');
    }
    catch (err) {
        (0, jsonResponse_1.errorResponse)(err, 400, err.message, res);
    }
});
exports.getCountryLogById = getCountryLogById;
const updateCountryLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, userId } = req.params;
        const result = yield CountryLogService.update(parseInt(id), parseInt(userId), req.body);
        if (result != null) {
            yield notificationService.update(result.id, result.notify_at);
        }
        (0, jsonResponse_1.successResponse)(res, result, 'Country Log upadted Successfully');
    }
    catch (err) {
        (0, jsonResponse_1.errorResponse)(err, 400, err.message, res);
    }
});
exports.updateCountryLog = updateCountryLog;
const deleteCountryLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, userId } = req.params;
        const result = yield CountryLogService.hardDelete(parseInt(id), parseInt(userId));
        (0, jsonResponse_1.successResponse)(res, result, 'Country log deleted successfully');
    }
    catch (err) {
        (0, jsonResponse_1.errorResponse)(err, 400, err.message, res);
    }
});
exports.deleteCountryLog = deleteCountryLog;
const getByPaging = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, pageSize, userId, sortDir, q } = req.query;
        const result = yield CountryLogService.getByPaging(parseInt(page), parseInt(pageSize), parseInt(userId), sortDir, q);
        (0, jsonResponse_1.successResponse)(res, result, "Country Log fetched successfully");
    }
    catch (err) {
        (0, jsonResponse_1.errorResponse)(err, 400, err.message, res);
    }
});
exports.getByPaging = getByPaging;
//# sourceMappingURL=countryLogController.js.map