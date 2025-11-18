"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const imageupload_1 = require("../imageUpload/imageupload");
const imageUploadRouter = (0, express_1.Router)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
imageUploadRouter.post("/upload", imageupload_1.imageUpload);
exports.default = imageUploadRouter;
//# sourceMappingURL=imageUploadRouter.js.map