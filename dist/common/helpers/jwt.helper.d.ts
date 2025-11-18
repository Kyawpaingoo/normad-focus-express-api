import { JwtPayload } from 'jsonwebtoken';
export declare function generateAccessToken(payload: object): string;
export declare function generateRefreshToken(payload: object): string;
export declare function verifyAccessToken(token: string): string | JwtPayload;
export declare function verifyRefreshToken(token: string): string | JwtPayload;
