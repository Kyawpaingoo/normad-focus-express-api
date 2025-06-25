import { Request, Response } from "express";
import * as AuthService from "../service/authService";
import { RegisterUserDto, LoginRequestDto, LoginResponseDto } from "./../dtos/userDtos";
import { errorResponse, successResponse } from "./../utils/jsonResponse";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      jwtUser?: string | JwtPayload;
    }
  }
}


export const register = async (req: Request, res: Response) : Promise<void> => {
    try {
        const user = await AuthService.registerUser(req.body as RegisterUserDto);

        successResponse(res, user, "User registered successfully");
    }
    catch(error: any)
    {
        errorResponse(error as Error, 400, error.message, res);
    }
}

export const login = async (req: Request, res: Response) : Promise<void> => {
    try {
        const response: LoginResponseDto = await AuthService.LoginUser(req.body as LoginRequestDto);

        res.cookie('accessToken', refreshToken, {
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

        successResponse(res, response, "User logged in successfully");
    }
    catch(error: any)
    {
        errorResponse(error as Error, 401, error.message, res);
    }
}

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.cookies.refreskToken as string;
        if(!token) throw new Error("Token not found in cookies");

        const {accessToken, refreshToken} = await AuthService.refreshTokenPair(token);

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

        successResponse(res, null, "Token refreshed successfully");
    }
    catch (error: any)
    {
        errorResponse(error as Error, 401, error.message, res);
    }
}

export const verifyUser = async  (req: Request, res: Response): Promise<void> => {
    try {
        const user = await AuthService.verifyUser(req.jwtUser as JwtPayload);

        successResponse(res, user, "User verified successfully");
    }
    catch (error: any)
    {
        errorResponse(error as Error, 401, error.message, res);
    }
}