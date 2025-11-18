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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const jwt_helper_1 = require("../../common/helpers/jwt.helper");
let AuthService = class AuthService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    registerUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password, confirmPassword } = user;
            const existingUser = yield this.prisma.user.findFirst({
                where: { email },
            });
            if (existingUser) {
                throw new common_1.BadRequestException('User already exists with this email');
            }
            if (password !== confirmPassword) {
                throw new common_1.BadRequestException('Passwords do not match');
            }
            if (password.length < 6) {
                throw new common_1.BadRequestException('Password must be at least 6 characters long');
            }
            const hashedPwd = yield this.hashedPassword(password);
            const result = yield this.prisma.user.create({
                data: {
                    name: username,
                    email,
                    password: hashedPwd,
                    created_at: new Date(),
                },
            });
            if (!result) {
                throw new common_1.BadRequestException('User registration failed');
            }
            return result;
        });
    }
    loginUser(loginDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = loginDto;
            const user = yield this.prisma.user.findFirst({
                where: { email },
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            if (!user.password) {
                throw new common_1.BadRequestException('User password is missing');
            }
            const isPasswordValid = yield this.validatePassword(password, user.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid password');
            }
            const accessToken = (0, jwt_helper_1.generateAccessToken)({ id: user.id, name: user.name });
            const refreshToken = (0, jwt_helper_1.generateRefreshToken)({ id: user.id, name: user.name });
            const result = yield this.prisma.user.update({
                where: { id: user.id },
                data: { refresh_token: refreshToken },
            });
            if (!result) {
                throw new common_1.BadRequestException('Failed to update user with refresh token');
            }
            return {
                accessToken,
                refreshToken,
                id: user.id,
                name: user.name,
                email: user.email,
            };
        });
    }
    refreshTokenPair(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decode = (0, jwt_helper_1.verifyRefreshToken)(token);
            const user = yield this.prisma.user.findFirst({
                where: { id: decode.id },
            });
            if (!user || !user.refresh_token) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            const newAccessToken = (0, jwt_helper_1.generateAccessToken)({ id: user.id, name: user.name });
            const newRefreshToken = (0, jwt_helper_1.generateRefreshToken)({ id: user.id, name: user.name });
            const updatedUser = yield this.prisma.user.update({
                where: { id: user.id },
                data: { refresh_token: newRefreshToken },
            });
            if (!updatedUser) {
                throw new common_1.BadRequestException('Failed to update user with new refresh token');
            }
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        });
    }
    verifyUser(jwtUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prisma.user.findFirst({
                where: { id: jwtUser.id },
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            return user;
        });
    }
    hashedPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt.hash(password, 10);
        });
    }
    validatePassword(password, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return bcrypt.compare(password, hashedPassword);
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map