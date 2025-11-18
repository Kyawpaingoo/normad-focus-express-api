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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../prisma"));
const AuthService = __importStar(require("../service/authService"));
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword'),
    compare: jest.fn().mockImplementation((password, hash) => Promise.resolve(password === 'testPassword' && hash === 'hashedPassword'))
}));
jest.mock('../utils/jwtHelper', () => {
    let userId = null;
    return {
        setUserId: (id) => { userId = id; },
        generateAccessToken: jest.fn().mockImplementation((payload) => `access-${payload.id}`),
        generateRefreshToken: jest.fn().mockImplementation((payload) => `refresh-${payload.id}`),
        verifyRefreshToken: jest.fn().mockImplementation((token) => {
            if (userId && token === `refresh-${userId}`) {
                return { id: userId, name: 'testUser' };
            }
            throw new Error('Invalid token');
        })
    };
});
describe('AuthService', () => {
    const getRegisterUserDto = () => ({
        username: 'testUser',
        email: 'test.user@example.com',
        password: 'testPassword',
        confirmPassword: 'testPassword'
    });
    const getLoginRequestDto = () => ({
        email: 'test.user@example.com',
        password: 'testPassword'
    });
    const getJwtPayload = (refreshToken) => ({
        refreshToken
    });
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma_1.default.user.deleteMany({ where: { email: 'test.user@example.com' } });
        const jwtHelper = require('../utils/jwtHelper');
        jwtHelper.setUserId(null);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma_1.default.user.deleteMany({ where: { email: 'test.user@example.com' } });
        yield prisma_1.default.$disconnect();
    }));
    test('should register a user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const userDto = getRegisterUserDto();
        const result = yield AuthService.registerUser(userDto);
        expect(result.email).toBe(userDto.email);
        expect(result.name).toBe(userDto.username);
        expect(result).toHaveProperty('id');
    }));
    test('should login a user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const userDto = getRegisterUserDto();
        const user = yield AuthService.registerUser(userDto);
        const jwtHelper = require('../utils/jwtHelper');
        jwtHelper.setUserId(user.id);
        const loginDto = getLoginRequestDto();
        const result = yield AuthService.LoginUser(loginDto);
        expect(result).toHaveProperty('accessToken', `access-${user.id}`);
        expect(result).toHaveProperty('refreshToken', `refresh-${user.id}`);
        expect(result.id).toBe(user.id);
        expect(result.name).toBe(userDto.username);
    }));
    test('should refresh token pair successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const userDto = getRegisterUserDto();
        const user = yield AuthService.registerUser(userDto);
        const jwtHelper = require('../utils/jwtHelper');
        jwtHelper.setUserId(user.id);
        const loginDto = getLoginRequestDto();
        const loginResult = yield AuthService.LoginUser(loginDto);
        const result = yield AuthService.refreshTokenPair(loginResult.refreshToken);
        expect(result).toHaveProperty('accessToken', `access-${user.id}`);
        expect(result).toHaveProperty('refreshToken', `refresh-${user.id}`);
        const updatedUser = yield prisma_1.default.user.findFirst({ where: { email: userDto.email } });
        expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.refresh_token).toBe(result.refreshToken);
    }));
    test('should fail to refresh token with invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(AuthService.refreshTokenPair('invalid-token')).rejects.toThrow('Invalid token');
    }));
});
//# sourceMappingURL=auth.service.test.js.map