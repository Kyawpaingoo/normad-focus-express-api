import { Response } from "express";
export declare function successResponse(res: Response, data: any, message?: string): void;
export declare function errorResponse(e: Error, status: number, message: string, res: Response): void;
export declare function icsContentResponse(res: Response, meetingId: number, icsContent: string): void;
