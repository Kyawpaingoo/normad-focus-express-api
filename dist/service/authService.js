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
exports.verifyUser = exports.refreshTokenPair = exports.LoginUser = exports.registerUser = void 0;
const prisma_1 = __importDefault(require("./../prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtHelper_1 = require("./../utils/jwtHelper");
const registerUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, confirmPassword } = user;
    const exisitingUser = yield (prisma_1.default === null || prisma_1.default === void 0 ? void 0 : prisma_1.default.user.findFirst({
        where: {
            email: email
        }
    }));
    if (exisitingUser)
        throw new Error("User already exists with this email");
    if (password !== confirmPassword)
        throw new Error("Passwords do not match");
    if (password.length < 6)
        throw new Error("Password must be at least 6 characters long");
    const hashedPwd = yield hashedPassword(password);
    const result = yield prisma_1.default.user.create({
        data: {
            name: username,
            email,
            password: hashedPwd,
            created_at: new Date(),
        }
    });
    if (!result) {
        throw new Error("User registration failed");
    }
    return result;
});
exports.registerUser = registerUser;
const LoginUser = (loginDto) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = loginDto;
    const user = yield prisma_1.default.user.findFirst({
        where: {
            email: email
        }
    });
    if (!user) {
        throw new Error("User not found");
    }
    if (!user.password) {
        throw new Error("User password is missing");
    }
    const isPasswordValid = yield ValidetePassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }
    const accessToken = (0, jwtHelper_1.generateAccessToken)({ id: user.id, name: user.name });
    const refreshToken = (0, jwtHelper_1.generateRefreshToken)({ id: user.id, name: user.name });
    const result = yield prisma_1.default.user.update({
        where: {
            id: user.id,
        },
        data: {
            refresh_token: refreshToken
        }
    });
    if (!result) {
        throw new Error("Failed to update user with refresh token");
    }
    return { accessToken, refreshToken, id: user.id, name: user.name, email: user.email };
});
exports.LoginUser = LoginUser;
const refreshTokenPair = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decode = (0, jwtHelper_1.verifyRefreshToken)(token);
    const user = yield prisma_1.default.user.findFirst({
        where: {
            id: decode.id,
        }
    });
    if (!user || !user.refresh_token) {
        throw new Error("Invalid refresh token");
    }
    const newAccessToken = (0, jwtHelper_1.generateAccessToken)({ id: user.id, name: user.name });
    const newRefreshToken = (0, jwtHelper_1.generateRefreshToken)({ id: user.id, name: user.name });
    const updatedUser = yield prisma_1.default.user.update({
        where: {
            id: user.id,
        },
        data: {
            refresh_token: newRefreshToken
        }
    });
    if (!updatedUser) {
        throw new Error("Failed to update user with new refresh token");
    }
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
});
exports.refreshTokenPair = refreshTokenPair;
const verifyUser = (jwtUser) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst({
        where: {
            id: jwtUser.id,
        }
    });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
});
exports.verifyUser = verifyUser;
const hashedPassword = (password) => {
    return bcrypt_1.default.hash(password, 10);
};
const ValidetePassword = (password, hashedPassword) => {
    return bcrypt_1.default.compare(password, hashedPassword);
};
//# sourceMappingURL=authService.js.map