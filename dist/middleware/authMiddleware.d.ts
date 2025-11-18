import { NextFunction, Request, Response } from "express";
import { JwtPayload } from 'jsonwebtoken';
declare global {
    namespace Express {
        interface Request {
            jwtUser?: string | JwtPayload;
        }
    }
}
export declare const auth: (req: Request, res: Response, next: NextFunction) => void;
