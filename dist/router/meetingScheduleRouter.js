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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const meetingScheduleController = __importStar(require("../controller/meetingScheduleController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const meetingScheduleRouter = (0, express_1.Router)();
meetingScheduleRouter.get('/get-by-paging', authMiddleware_1.auth, meetingScheduleController.getByPaging);
meetingScheduleRouter.get('/get-by-id/:id/:userId', meetingScheduleController.getByID);
meetingScheduleRouter.get('/generate-ics-content/:id/:userId', meetingScheduleController.generateICSContent);
meetingScheduleRouter.put('/update/:id/:userId', meetingScheduleController.updateMeetingSchedule);
meetingScheduleRouter.patch('/soft-delete/:id/:userId', meetingScheduleController.softDeleteMeetingSchedule);
meetingScheduleRouter.delete('/hard-delete/:id/:userId', meetingScheduleController.hardDeleteMeetingSchedule);
meetingScheduleRouter.post('/insert', meetingScheduleController.insertMeetingSchedule);
exports.default = meetingScheduleRouter;
//# sourceMappingURL=meetingScheduleRouter.js.map