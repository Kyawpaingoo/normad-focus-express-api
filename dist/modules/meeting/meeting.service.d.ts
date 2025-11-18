import { PrismaService } from '../../database/prisma.service';
import { MeetingSchedule } from '@prisma/client';
import { UpsertMeetingDto } from './dto/upsert-meeting.dto';
import { PaginationResponse, sortDirection } from '../../common/types/pagination.types';
export declare class MeetingService {
    private prisma;
    constructor(prisma: PrismaService);
    insert(dto: UpsertMeetingDto): Promise<MeetingSchedule>;
    getById(id: number, userId: number): Promise<MeetingSchedule>;
    generateICS(meeting: MeetingSchedule): Promise<string>;
    update(id: number, user_id: number, meeting: UpsertMeetingDto): Promise<MeetingSchedule>;
    softDelete(id: number, user_id: number): Promise<string>;
    hardDelete(id: number, user_id: number): Promise<string>;
    getbyPaging(page: number, pageSize: number, userId: number, sortDir: sortDirection, q?: string): Promise<PaginationResponse<MeetingSchedule>>;
}
