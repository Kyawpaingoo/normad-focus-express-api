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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_service_1 = require("../../common/cloudinary/cloudinary.service");
const streamifier_1 = __importDefault(require("streamifier"));
let ImageService = class ImageService {
    constructor(cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }
    uploadImage(base64) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!base64) {
                throw new common_1.BadRequestException('No file uploaded');
            }
            try {
                const base64Data = base64.split(',')[1];
                const imageBuffer = Buffer.from(base64Data, 'base64');
                const cloudinary = this.cloudinaryService.getCloudinary();
                const result = yield new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream({
                        folder: 'itclubweb',
                        resource_type: 'auto',
                        public_id: `${Date.now().toString()}_screenshot`,
                        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
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
                return result.secure_url;
            }
            catch (err) {
                throw new common_1.InternalServerErrorException('Image upload failed');
            }
        });
    }
};
exports.ImageService = ImageService;
exports.ImageService = ImageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cloudinary_service_1.CloudinaryService])
], ImageService);
//# sourceMappingURL=image.service.js.map