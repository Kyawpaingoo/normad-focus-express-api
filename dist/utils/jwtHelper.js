"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.JWT_SECRET;
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET;
function generateAccessToken(payload) {
    if (!secretKey) {
        throw new Error("JWT secret key is not defined");
    }
    return jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: '15m' });
}
function generateRefreshToken(payload) {
    if (!refreshSecretKey) {
        throw new Error("Refresh token secret key is not defined");
    }
    return jsonwebtoken_1.default.sign(payload, refreshSecretKey, { expiresIn: '7d' });
}
function verifyAccessToken(token) {
    if (!secretKey) {
        throw new Error("JWT secret key is not defined");
    }
    try {
        return jsonwebtoken_1.default.verify(token, secretKey);
    }
    catch (error) {
        throw new Error("Invalid access token");
    }
}
function verifyRefreshToken(token) {
    if (!refreshSecretKey) {
        throw new Error("Refresh token secret key is not defined");
    }
    try {
        return jsonwebtoken_1.default.verify(token, refreshSecretKey);
    }
    catch (error) {
        throw new Error("Invalid refresh token");
    }
}
//# sourceMappingURL=jwtHelper.js.map