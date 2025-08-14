import { CountryLog } from "@prisma/client";
import { upsertCountryLog } from "../dtos/countryLogDto";
import prisma from "../prisma";
import { PaginationResponse, sortDirection } from "src/utils/pagination";

export const insert = async (data: upsertCountryLog): Promise<CountryLog> => {

    const result: CountryLog | undefined = await prisma?.countryLog.create({
        data: {
            user_id: data.user_id,
            country_name: data.country_name,
            visa_type: data.visa_type,
            visa_limit_days: data.visa_limit_days,
            entry_date: data.entry_date,
            exit_date: data.exit_date,
            notify_at: data.notify_at,
            created_at: new Date(),
        }
    });

    if(!result) throw new Error('Country Log creation failed');

    return result;
}

export const getById = async (id: number, userId: number): Promise<CountryLog> => {
    const result: CountryLog | null | undefined = await prisma.countryLog.findFirst({
        where: {
            id: id,
            user_id: userId
        }
    });

    if(!result) throw new Error('Country log not found');

    return result;
}

export const update = async (id: number, userId: number, data: upsertCountryLog): Promise<CountryLog> => {
    const result: CountryLog | undefined = await prisma.countryLog.update({
        where: {
            id: id,
            user_id: userId
        },
        data: {
            ...data
        }
    });

    if(!result) throw new Error('Failed to update Country Log');

    return result;
}

export const hardDelete = async (id: number, userId: number): Promise<string> => {
    const result: CountryLog | undefined = await prisma.countryLog.delete({
        where: {
            id: id,
            user_id: userId
        },
       
    });

    if(!result) throw new Error('Country Log deletion failed');

    return "Country Log deleted successfully";
}

export const getByPaging = async (page: number, pageSize: number, userId: number, sortDir: sortDirection, q?: string): Promise<PaginationResponse<CountryLog>> => {
    const whereClause = {
        user_id: userId,
        ...(q && {
            title: {
                constants: q,
                mode: 'insensitive' as const
            }
        })
    }

    const totalCount = await prisma.countryLog.count({
        where: whereClause
    })

    const countryLogs = await prisma.countryLog.findMany({
        where: whereClause,
        orderBy: {
            created_at: sortDir === 'asc' ? 'desc' : 'asc'
        },
        skip: (page -1) * pageSize,
        take: pageSize
    });

    const totalPage = Math.ceil(totalCount / pageSize);

    if(!countryLogs || countryLogs.length == 0) return {
        totalCount: 0,
        totalPage: 0,
        results: [],
        page,
        pageSize,
        hasNextPage: false,
        hasPrevPage: false
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