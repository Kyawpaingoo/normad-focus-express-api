import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { MeetingSchedule } from '@prisma/client';
import { UpsertMeetingDto } from './dto/upsert-meeting.dto';
import { createEvent, DateTime } from 'ics';
import { PaginationResponse, sortDirection } from '../../common/types/pagination.types';

@Injectable()
export class MeetingService {
  constructor(private prisma: PrismaService) {}

  async insert(dto: UpsertMeetingDto): Promise<MeetingSchedule> {
    const result = await this.prisma.meetingSchedule.create({
      data: {
        user_id: dto.user_id,
        title: dto.title,
        start_time: dto.start_time,
        end_time: dto.end_time,
        description: dto.description,
        created_at: new Date(),
        is_deleted: false,
      },
    });

    if (!result) {
      throw new BadRequestException('Meeting schedule creation failed');
    }

    return result;
  }

  async getById(id: number, userId: number): Promise<MeetingSchedule> {
    const result = await this.prisma.meetingSchedule.findFirst({
      where: {
        id: id,
        user_id: userId,
        is_deleted: false,
      },
    });

    if (!result) {
      throw new NotFoundException('Meeting Schedule not found');
    }

    return result;
  }

  async generateICS(meeting: MeetingSchedule): Promise<string> {
    if (!meeting) {
      throw new NotFoundException('Meeting not found');
    }

    const start: DateTime = [
      meeting.start_time.getFullYear(),
      meeting.start_time.getMonth() + 1,
      meeting.start_time.getDate(),
      meeting.start_time.getHours(),
      meeting.start_time.getMinutes(),
    ];

    const end: DateTime = [
      meeting.end_time.getFullYear(),
      meeting.end_time.getMonth() + 1,
      meeting.end_time.getDate(),
      meeting.end_time.getHours(),
      meeting.end_time.getMinutes(),
    ];

    const created: DateTime | undefined = meeting.created_at
      ? [
          meeting.created_at.getFullYear(),
          meeting.created_at.getMonth() + 1,
          meeting.created_at.getDate(),
          meeting.created_at.getHours(),
          meeting.created_at.getMinutes(),
        ]
      : undefined;

    return new Promise((resolve, reject) => {
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
          },
        },
        (error, value) => {
          if (error) {
            reject(new BadRequestException('ICS generation failed: ' + error.message));
          } else {
            resolve(value);
          }
        },
      );
    });
  }

  async update(id: number, user_id: number, meeting: UpsertMeetingDto): Promise<MeetingSchedule> {
    const result = await this.prisma.meetingSchedule.update({
      where: {
        id: id,
        user_id: user_id,
      },
      data: {
        ...meeting,
      },
    });

    if (!result) {
      throw new BadRequestException('Failed to update Meeting Schedule');
    }

    return result;
  }

  async softDelete(id: number, user_id: number): Promise<string> {
    const result = await this.prisma.meetingSchedule.update({
      where: {
        id: id,
        user_id: user_id,
      },
      data: {
        is_deleted: true,
      },
    });

    if (!result) {
      throw new BadRequestException('Meeting Schedule deletion failed');
    }

    return 'Meeting Schedule deleted successfully';
  }

  async hardDelete(id: number, user_id: number): Promise<string> {
    const result = await this.prisma.meetingSchedule.delete({
      where: {
        id: id,
        user_id: user_id,
      },
    });

    if (!result) {
      throw new BadRequestException('Meeting Schedule deletion failed');
    }

    return 'Meeting Schedule deleted successfully';
  }

  async getbyPaging(
    page: number,
    pageSize: number,
    userId: number,
    sortDir: sortDirection,
    q?: string,
  ): Promise<PaginationResponse<MeetingSchedule>> {
    const whereClause = {
      user_id: userId,
      is_deleted: false,
      ...(q && {
        title: {
          contains: q,
          mode: 'insensitive' as const,
        },
      }),
    };

    const totalCount = await this.prisma.meetingSchedule.count({
      where: whereClause,
    });

    const meetingSchedules = await this.prisma.meetingSchedule.findMany({
      where: whereClause,
      orderBy: {
        created_at: sortDir === 'asc' ? 'asc' : 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPage = Math.ceil(totalCount / pageSize);

    if (!meetingSchedules || meetingSchedules.length === 0) {
      return {
        totalCount: 0,
        totalPage: 0,
        results: [],
        page,
        pageSize,
        hasNextPage: false,
        hasPrevPage: false,
      };
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
}
