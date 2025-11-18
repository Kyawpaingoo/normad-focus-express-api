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
exports.verifyUser = exports.refreshToken = exports.login = exports.register = void 0;
const AuthService = __importStar(require("../service/authService"));
const jsonResponse_1 = require("./../utils/jsonResponse");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield AuthService.registerUser(req.body);
        const { id, name, email } = user;
        (0, jsonResponse_1.successResponse)(res, { id, name, email }, "User registered successfully");
    }
    catch (error) {
        (0, jsonResponse_1.errorResponse)(error, 400, error.message, res);
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield AuthService.LoginUser(req.body);
        const { id, name, email, accessToken, refreshToken } = response;
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
            secure: false,
            sameSite: 'lax'
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: false,
            sameSite: 'lax'
        });
        (0, jsonResponse_1.successResponse)(res, { id, name, email }, "User logged in successfully");
    }
    catch (error) {
        (0, jsonResponse_1.errorResponse)(error, 401, error.message, res);
    }
});
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.refreshToken;
        if (!token)
            throw new Error("Token not found in cookies");
        const { accessToken, refreshToken } = yield AuthService.refreshTokenPair(token);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
            secure: false,
            sameSite: 'lax'
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: false,
            sameSite: 'lax'
        });
        (0, jsonResponse_1.successResponse)(res, null, "Token refreshed successfully");
    }
    catch (error) {
        (0, jsonResponse_1.errorResponse)(error, 401, error.message, res);
    }
});
exports.refreshToken = refreshToken;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield AuthService.verifyUser(req.jwtUser);
        const { id, name, email } = user;
        (0, jsonResponse_1.successResponse)(res, { id, name, email }, "User verified successfully");
    }
    catch (error) {
        (0, jsonResponse_1.errorResponse)(error, 403, error.message, res);
    }
});
exports.verifyUser = verifyUser;
//# sourceMappingURL=authController.js.map