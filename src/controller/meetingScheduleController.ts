import { Request, Response } from "express"
import * as meetingSchdeuleService from '../service/meetingScheduleService';
import { upsertMeetingSchdeuleDto } from "../dtos/meetingScheduleDto";
import { errorResponse, icsContentResponse, successResponse } from "../utils/jsonResponse";
import { PaginationResponse, sortDirection } from "../utils/pagination";
import { MeetingSchedule } from "@prisma/client";

export const insertMeetingSchedule = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await meetingSchdeuleService.insert(req.body as upsertMeetingSchdeuleDto);

        successResponse(res, result, 'Meeting Schedule inserted sucessfully');
    }
    catch(error: any) {
        errorResponse(error as Error, 400, error.message, res);
    }
}

export const getByID = async(req: Request, res: Response): Promise<void> => {
    try {
        const {id, userId} = req.params;
        const reuslt = await meetingSchdeuleService.getById(parseInt(id), parseInt(userId));

        successResponse(res, reuslt, "Meeting details fetched successfully");
    }
    catch(error: any) {
        errorResponse(error as Error, 400, error.message, res);
    }
}

export const generateICSContent = async (req: Request, res: Response): Promise<void> => {
    try {
        const {id, userId} = req.params;
        const meeting = await meetingSchdeuleService.getById(parseInt(id), parseInt(userId));

        const icsContent = await meetingSchdeuleService.generateICS(meeting);

        icsContentResponse(res, meeting.id, icsContent);
    }
    catch(error: any) {
        errorResponse(error as Error, 400, error.message, res);
    }
}

export const updateMeetingSchedule = async (req: Request, res: Response): Promise<void> => {
    try {
        const {id, userId} = req.params;
        const result = await meetingSchdeuleService.update(parseInt(id), parseInt(userId), req.body as upsertMeetingSchdeuleDto);
        successResponse(res, result, "Meeting Schedule updated successfully");
    }
    catch(error: any) {
        errorResponse(error as Error, 400, error.message, res);
    }
}

export const getByPaging = async (req: Request, res: Response): Promise<void> => {
    try {
        const {page, pageSize, userId, sortDir, q} = req.query;
        const result: PaginationResponse<MeetingSchedule> = await meetingSchdeuleService.getbyPaging(parseInt(page as string), parseInt(pageSize as string), parseInt(userId as string), sortDir as sortDirection, q as string);

        successResponse(res, result, 'Meeting Schedule Paging fetched successfully');
    }
    catch(error: any) {
        errorResponse(error as Error, 400, error.message, res);
    }
}

export const softDeleteMeetingSchedule = async (req: Request, res: Response): Promise<void> => {
    try {
        const {id, userId} = req.params;
        const result = await meetingSchdeuleService.softDelete(parseInt(id), parseInt(userId));
        successResponse(res, result, "Meeting Schedule deleted successfully");
    }
    catch(error: any) {
        errorResponse(error as Error, 400, error.message, res);
    }
}
    
export const hardDeleteMeetingSchedule = async (req: Request, res: Response) : Promise<void> => {
    try {
        const {id, userId} = req.params;
        const result = await meetingSchdeuleService.hardDelete(parseInt(id), parseInt(userId));
        successResponse(res, result, "Meeting Schedule deleted successfully");
    }
    catch(error: any) {
        errorResponse(error as Error, 400, error.message, res);
    }
}