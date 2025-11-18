import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CountryLog } from '@prisma/client';
import { UpsertCountryLogDto } from './dto/upsert-country-log.dto';
import { PaginationResponse, sortDirection } from '../../common/types/pagination.types';

@Injectable()
export class CountryLogService {
  constructor(private prisma: PrismaService) {}

  async insert(data: UpsertCountryLogDto): Promise<CountryLog> {
    const result = await this.prisma.countryLog.create({
      data: {
        user_id: data.user_id,
        country_name: data.country_name,
        visa_type: data.visa_type,
        visa_limit_days: data.visa_limit_days,
        entry_date: data.entry_date,
        exit_date: data.exit_date,
        notify_at: data.notify_at || null,
        created_at: new Date(),
      },
    });

    if (!result) {
      throw new BadRequestException('Country Log creation failed');
    }

    return result;
  }

  async getById(id: number, userId: number): Promise<CountryLog> {
    const result = await this.prisma.countryLog.findFirst({
      where: {
        id: id,
        user_id: userId,
      },
    });

    if (!result) {
      throw new NotFoundException('Country log not found');
    }

    return result;
  }

  async update(id: number, userId: number, data: UpsertCountryLogDto): Promise<CountryLog> {
    const result = await this.prisma.countryLog.update({
      where: {
        id: id,
        user_id: userId,
      },
      data: {
        ...data,
      },
    });

    if (!result) {
      throw new BadRequestException('Failed to update Country Log');
    }

    return result;
  }

  async hardDelete(id: number, userId: number): Promise<string> {
    const result = await this.prisma.countryLog.delete({
      where: {
        id: id,
        user_id: userId,
      },
    });

    if (!result) {
      throw new BadRequestException('Country Log deletion failed');
    }

    return 'Country Log deleted successfully';
  }

  async getByPaging(
    page: number,
    pageSize: number,
    userId: number,
    sortDir: sortDirection,
    q?: string,
  ): Promise<PaginationResponse<CountryLog>> {
    const whereClause = {
      user_id: userId,
      ...(q && {
        country_name: {
          contains: q,
          mode: 'insensitive' as const,
        },
      }),
    };

    const totalCount = await this.prisma.countryLog.count({
      where: whereClause,
    });

    const countryLogs = await this.prisma.countryLog.findMany({
      where: whereClause,
      orderBy: {
        created_at: sortDir === 'asc' ? 'asc' : 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPage = Math.ceil(totalCount / pageSize);

    if (!countryLogs || countryLogs.length === 0) {
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

    const result: PaginationResponse<CountryLog> = {
      totalCount,
      totalPage,
      page,
      pageSize,
      hasNextPage: page < totalPage,
      hasPrevPage: page > 1,
      results: countryLogs,
    };

    return result;
  }
}
