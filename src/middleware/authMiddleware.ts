import e, { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      jwtUser?: string | JwtPayload;
    }
  }
}

const secretKey : string | undefined = process.env.JWT_SECRET as string
export const auth = (req: Request, res: Response, next: NextFunction): void => {
    const token: string | undefined = req.cookies.accessToken;
    
    if(!token) {
      res.status(403).json({error: 'Token not found'});
      return;
    } 

    jwt.verify(token, secretKey, (err, data) => {
      if(err) {
        res.status(403).json({error: 'Invalid token'});
        return;
      }
      req.jwtUser = data;
      next();
    })
}