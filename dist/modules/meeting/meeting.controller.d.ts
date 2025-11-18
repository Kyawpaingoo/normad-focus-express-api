import { Response } from 'express';
import { MeetingService } from './meeting.service';
import { UpsertMeetingDto } from './dto/upsert-meeting.dto';
export declare class MeetingController {
    private readonly meetingService;
    constructor(meetingService: MeetingService);
    insertMeetingSchedule(meetingDto: UpsertMeetingDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getByID(id: number, userId: number, res: Response): Promise<Response<any, Record<string, any>>>;
    generateICSContent(id: number, userId: number, res: Response): Promise<Response<any, Record<string, any>>>;
    updateMeetingSchedule(id: number, userId: number, meetingDto: UpsertMeetingDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getByPaging(query: any, res: Response): Promise<Response<any, Record<string, any>>>;
    softDeleteMeetingSchedule(id: number, userId: number, res: Response): Promise<Response<any, Record<string, any>>>;
    hardDeleteMeetingSchedule(id: number, userId: number, res: Response): Promise<Response<any, Record<string, any>>>;
}
