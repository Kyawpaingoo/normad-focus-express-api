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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const register_user_dto_1 = require("./dto/register-user.dto");
const login_request_dto_1 = require("./dto/login-request.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    register(registerDto, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.authService.registerUser(registerDto);
                const { id, name, email } = user;
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: { id, name, email },
                    msg: 'User registered successfully',
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
    login(loginDto, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.authService.loginUser(loginDto);
                const { id, name, email, accessToken, refreshToken } = response;
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    maxAge: 15 * 60 * 1000,
                    secure: false,
                    sameSite: 'lax',
                });
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000,
                    secure: false,
                    sameSite: 'lax',
                });
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: { id, name, email },
                    msg: 'User logged in successfully',
                });
            }
            catch (error) {
                return res.status(common_1.HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    error: error.message,
                    status: common_1.HttpStatus.UNAUTHORIZED,
                });
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.cookies.refreshToken;
                if (!token) {
                    throw new Error('Token not found in cookies');
                }
                const { accessToken, refreshToken } = yield this.authService.refreshTokenPair(token);
                res.cookie('accessToken', accessToken, {
                    httpOnly: true,
                    maxAge: 15 * 60 * 1000,
                    secure: false,
                    sameSite: 'lax',
                });
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000,
                    secure: false,
                    sameSite: 'lax',
                });
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: null,
                    msg: 'Token refreshed successfully',
                });
            }
            catch (error) {
                return res.status(common_1.HttpStatus.UNAUTHORIZED).json({
                    success: false,
                    error: error.message,
                    status: common_1.HttpStatus.UNAUTHORIZED,
                });
            }
        });
    }
    verifyUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.authService.verifyUser(req.user);
                const { id, name, email } = user;
                return res.status(common_1.HttpStatus.OK).json({
                    success: true,
                    data: { id, name, email },
                    msg: 'User verified successfully',
                });
            }
            catch (error) {
                return res.status(common_1.HttpStatus.FORBIDDEN).json({
                    success: false,
                    error: error.message,
                    status: common_1.HttpStatus.FORBIDDEN,
                });
            }
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_user_dto_1.RegisterUserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_request_dto_1.LoginRequestDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('refresh-token'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Get)('verify-user'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyUser", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('api/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map