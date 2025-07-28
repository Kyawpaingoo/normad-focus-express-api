import { Response } from "express";
import { errorResponseDto, successResponseDto } from "../dtos/responseDto";

// Success Response Function
export function successResponse(res: Response, data: any, message: string = "Operation successful") {
    const responsePayload: successResponseDto = {
        success: true,
        data,
        msg: message,
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

export function icsContentResponse(res: Response, meetingId: number, icsContent: string) {
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename=meeting-${meetingId}.ics`);
    res.send(icsContent);
}
