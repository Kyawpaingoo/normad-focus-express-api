import { MeetingSchedule } from '@prisma/client';
import { upsertMeetingSchdeuleDto } from '../dtos/meetingScheduleDto';
import { createEvent, DateTime } from 'ics';
import { PaginationResponse, sortDirection } from '../utils/pagination';
import prisma from "../prisma";

export const insert = async (dto: upsertMeetingSchdeuleDto): Promise<MeetingSchedule> => {
    const result: MeetingSchedule | undefined = await prisma?.meetingSchedule.create({
        data: {
            ...dto,
            is_deleted: false
        }
    });

    if(!result) throw new Error('Meeting schedule creation failed');

    return result;
}

export const getById = async (id: number , userId: number): Promise<MeetingSchedule> => {
    const result: MeetingSchedule | null | undefined = await prisma?.meetingSchedule.findFirst({
        where: {
            id: id,
            user_id: userId,
            is_deleted: false
        }
    });

    if(!result) throw new Error('Meeting Schedule not found');

    return result;
}

export const generateICS = async (meeting: MeetingSchedule): Promise<string> => {
    if(!meeting) throw new Error('Meeting not found');

    const start: DateTime = [
        meeting.start_time.getFullYear(),
        meeting.start_time.getMonth() + 1,
        meeting.start_time.getDate(),
        meeting.start_time.getHours(),
        meeting.start_time.getMinutes()
    ];

    const end: DateTime = [
        meeting.end_time.getFullYear(),
        meeting.end_time.getMonth() + 1,
        meeting.end_time.getDate(),
        meeting.end_time.getHours(),
        meeting.end_time.getMinutes()
    ]

    const created: DateTime | undefined = meeting.created_at
        ? [
            meeting.created_at.getFullYear(),
            meeting.created_at.getMonth() + 1,
            meeting.created_at.getDate(),
            meeting.created_at.getHours(),
            meeting.created_at.getMinutes(),
        ]
        : undefined;

    return new Promise((resolve, reject)=> {
        createEvent(
            {
                start,
                end,
                title: meeting.title ?? 'meeting',
                description: meeting?.description ?? '',
                location: 'Online',
                status: 'CONFIRMED',
                created,
                organizer: {
                    name: 'Productivity Dashboard',
                    email: 'no-reply@yourapp.com',
                }
            },
            (error, value) => {
                if (error) {
                    reject(new Error('ICS generation failed: ' + error.message));
                } else {
                    resolve(value);
                }
            }
        )
    })
}

export const update = async (id: number, user_id: number, meeting: upsertMeetingSchdeuleDto): Promise<MeetingSchedule> => {
    const result: MeetingSchedule | undefined = await prisma?.meetingSchedule.update({
        where: {
            id: id,
            user_id: user_id
        },
        data: {
            ...meeting
        }
    })

    if(!result) throw new Error('Failed to update Meeting Schedule');

    return result
}

export const softDelete = async (id: number, user_id: number): Promise<string> => {
    const reuslt: MeetingSchedule | undefined = await prisma?.meetingSchedule.update({
        where: {
            id: id,
            user_id: user_id
        },
        data: {
            is_deleted: true
        }
    });

    if(!reuslt) throw new Error('Meeting Schedule deletion failed');

    return "Meeting Schedule deleted successfully";
}

export const hardDelete = async (id: number, user_id: number): Promise<string> => {
    const reuslt: MeetingSchedule | undefined = await prisma?.meetingSchedule.delete({
        where: {
            id: id,
            user_id: user_id
        }
    })

    if(!reuslt) throw new Error('Meeting Schedule deletion failed');

    return "Meeting Schedule deleted successfully";
}

export const getbyPaging = async (page: number, pageSize: number, userId: number, sortDir: sortDirection, q?: string): Promise<PaginationResponse<MeetingSchedule>> => {
    
    const whereClause = {
        user_id: userId,
        is_deleted: false,
        ...(q && {
            title: {
                constants: q,
                mode: 'insensitive' as const
            }
        })
    };

    const totalCount = await prisma.meetingSchedule.count({
        where: whereClause
    });

    const meetingSchedules = await prisma?.meetingSchedule.findMany({
        where: whereClause,
        orderBy: {
            created_at: sortDir === 'asc' ? 'desc' : 'asc'
        },
        skip: (page - 1) * pageSize,
        take: pageSize
    });

    const totalPage = Math.ceil(totalCount / pageSize);

    if(!meetingSchedules || meetingSchedules.length == 0) return {
        totalCount: 0,
        totalPage: 0,
        results: [],
        page,
        pageSize,
        hasNextPage: false,
        hasPrevPage: false
    }

    const result: PaginationResponse<MeetingSchedule> = {
        totalCount,
        totalPage,
        page,
        pageSize,
        hasNextPage: page < totalPage,
        hasPrevPage: page > 1,
        results: meetingSchedules,
    };

    return result;
}