import { Response } from "express";
import { errorResponseDto, successResponseDto } from "../dtos/responseDto";

// Success Response Function
export function successResponse(res: Response, data: any, message: string = "Operation successful", token?: string, pagination?: any) {
    const responsePayload: successResponseDto = {
        success: true,
        data,
        msg: message,
        token: token || null,
        pagination: pagination || null,
    };

    res.status(200).json(responsePayload);
}

// Error Response Function
export function errorResponse(e: Error, status: number, message: string = e.message, res: Response) {
    // console.error(e);

    const responsePayload: errorResponseDto = {
        success: false,
        error: message,
        status,
    };

    res.status(status).json(responsePayload);
}
