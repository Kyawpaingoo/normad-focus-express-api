import { Request, Response } from "express";
import * as AuthService from "../service/authService";
import { RegisterUserDto, LoginRequestDto, LoginResponseDto } from "./../dtos/userDtos";
import { errorResponse, successResponse } from "./../utils/jsonResponse";

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

        res.cookie('token', response.refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});

        successResponse(res, response, "User logged in successfully");
    }
    catch(error: any)
    {
        errorResponse(error as Error, 401, error.message, res);
    }
}

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.cookies.token as string;
        if(!token) throw new Error("Token not found in cookies");

        const {accessToken, refreshToken} = await AuthService.refreshTokenPair(token);

        res.cookie('token', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});

        successResponse(res, {accessToken, refreshToken}, "Token refreshed successfully");
    }
    catch (error: any)
    {
        errorResponse(error as Error, 403, error.message, res);
    }
}