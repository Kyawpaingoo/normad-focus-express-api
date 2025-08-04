import { Request, Response } from "express";
import * as CountryLogService from '../service/countryLogService';
import * as notificationService from '../service/notificationService';
import { upsertCountryLog } from "../dtos/countryLogDto";
import { upsertNotificationRequestDto } from "../dtos/notificationDto";
import { errorResponse, successResponse } from "../utils/jsonResponse";
import { PaginationResponse, sortDirection } from "../utils/pagination";
import { CountryLog } from "@prisma/client";

export const createCountryLog = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await CountryLogService.insert(req.body as upsertCountryLog);

        if(result.notify_at != null) {
            const notificationDto: upsertNotificationRequestDto = {
                user_id: result.user_id,
                source_id: result.id,
                source_type: 'Country Log',
                title: 'Visa Expiry Alert',
                message: `Reminder: Your ${result.visa_type} will be seen expired in ${result.exit_date}`,
                notify_at: result.notify_at
            };

            await notificationService.insert(notificationDto)
        }

        successResponse(res,result, 'Country Log created successfully')
    } catch (err: any) { 
        errorResponse(err as Error, 400, err.message, res)
    }
}

export const getCountryLogById =  async (req: Request, res: Response): Promise<void> => {
    try {
        const {id, userId} = req.params;
        const result = await CountryLogService.getById(parseInt(id), parseInt(userId));

        successResponse(res, result, 'Country log details fetch successfull');
    } catch(err: any) {
        errorResponse(err as Error, 400, err.message, res);
    }
}

export const updateCountryLog = async (req: Request, res: Response): Promise<void> => {
    try {
        const {id, userId} = req.params;
        const result = await CountryLogService.update(parseInt(id), parseInt(userId), req.body as upsertCountryLog);

        if(result != null) {
            await notificationService.update(result.id, result.notify_at);
        }

        successResponse(res, result, 'Country Log upadted Successfully');
    } catch(err: any) {
        errorResponse(err as Error, 400, err.message, res)
    }
}

export const deleteCountryLog = async (req: Request, res: Response): Promise<void> => {
    try {
        const {id, userId} = req.params;
        const result = await CountryLogService.hardDelete(parseInt(id), parseInt(userId));

        successResponse(res, result, 'Country log deleted successfully')
    } catch(err: any) {
        errorResponse(err as Error, 400, err.message, res);
    }
}

export const getByPaging = async (req: Request, res: Response): Promise<void> => {
    try {
        const {page, pageSize, userId, sortDir, q} = req.query;
        const result: PaginationResponse<CountryLog> = await CountryLogService.getByPaging(parseInt(page as string), parseInt(pageSize as string), parseInt(userId as string), sortDir as sortDirection, q as string);

        successResponse(res, result, "Country Log fetched successfully");
    } catch(err: any) {
        errorResponse(err as Error, 400, err.message, res);
    }
}