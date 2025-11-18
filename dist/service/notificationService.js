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
exports.update = exports.insert = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const insert = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.notification.create({
        data: Object.assign(Object.assign({}, data), { created_at: new Date(), sent_at: null })
    }));
    if (!result)
        throw new Error("Notification insertion failed");
    return result;
});
exports.insert = insert;
const update = (id, notify_at) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.notification.update({
        where: {
            id: id
        },
        data: {
            notify_at: notify_at
        }
    }));
    if (!result)
        throw new Error("Notification update failed");
    return result;
});
exports.update = update;
//# sourceMappingURL=notificationService.js.map