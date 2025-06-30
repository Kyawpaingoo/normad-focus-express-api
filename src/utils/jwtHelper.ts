import jwt, { JwtPayload } from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET
const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET

export function generateAccessToken(payload: object): string {
    if (!secretKey) {
        throw new Error("JWT secret key is not defined");
    }
    return jwt.sign(payload, secretKey, { expiresIn: '15m' });
}

export function generateRefreshToken(payload: object): string {
    if (!refreshSecretKey) {
        throw new Error("Refresh token secret key is not defined");
    }
    return jwt.sign(payload, refreshSecretKey, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string) : string | JwtPayload {
    if (!secretKey) {
        throw new Error("JWT secret key is not defined");
    }
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        throw new Error("Invalid access token");
    }
}

export function verifyRefreshToken(token: string) : string | JwtPayload {
    if (!refreshSecretKey) {
        throw new Error("Refresh token secret key is not defined");
    }
    try {
        return jwt.verify(token, refreshSecretKey);
    } catch (error) {
        throw new Error("Invalid refresh token");
    }
}