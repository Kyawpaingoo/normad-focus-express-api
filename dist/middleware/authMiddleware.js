"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretKey = process.env.JWT_SECRET;
const auth = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        res.status(403).json({ error: 'Token not found' });
        return;
    }
    jsonwebtoken_1.default.verify(token, secretKey, (err, data) => {
        if (err) {
            res.status(403).json({ error: 'Invalid token' });
            return;
        }
        req.jwtUser = data;
        next();
    });
};
exports.auth = auth;
//# sourceMappingURL=authMiddleware.js.map