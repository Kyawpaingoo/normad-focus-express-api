import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
declare global {
    namespace Express {
        interface Request {
            jwtUser?: string | JwtPayload;
        }
    }
}
export declare const register: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const refreshToken: (req: Request, res: Response) => Promise<void>;
export declare const verifyUser: (req: Request, res: Response) => Promise<void>;
