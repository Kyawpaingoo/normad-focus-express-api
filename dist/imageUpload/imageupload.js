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
exports.imageUpload = void 0;
const cloudinaryConfig_1 = __importDefault(require("../cloudinaryConfig"));
const streamifier_1 = __importDefault(require("streamifier"));
const imageUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { base64 } = req.body;
        if (!base64) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }
        const base64Data = base64.split(",")[1];
        const imageBuffer = Buffer.from(base64Data, "base64");
        const result = yield new Promise((resolve, reject) => {
            const uploadStream = cloudinaryConfig_1.default.uploader.upload_stream({
                folder: "itclubweb",
                resource_type: "auto",
                public_id: `${Date.now().toString()}_screenshot`,
                transformation: [
                    { quality: "auto", fetch_format: "auto" },
                ],
            }, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
            streamifier_1.default.createReadStream(imageBuffer).pipe(uploadStream);
        });
        res.status(200).json({ url: result.secure_url });
    }
    catch (err) {
        res.status(500).json({ error: "Image upload failed" });
    }
});
exports.imageUpload = imageUpload;
//# sourceMappingURL=imageupload.js.map