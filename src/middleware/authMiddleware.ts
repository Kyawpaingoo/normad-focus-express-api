import { NextFunction, Request, Response } from "express";
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
    const {authorization} = req.headers;

    const token: string | undefined= authorization && authorization.split(' ')[1];
    if(!token) {
      res.status(401).json({error: 'Token not found'});
      return;
    } 

    const user = jwt.verify(token, secretKey) as JwtPayload

    if(!user) {
      res.status(401).json({error: 'Invalid token'});
      return;
    } 

    req.jwtUser = user;
    next();
}