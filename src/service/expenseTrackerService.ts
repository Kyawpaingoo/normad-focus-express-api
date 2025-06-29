import { Expense } from "@prisma/client";
import { upsertExpenseRequestDto } from "../dtos/expenseTrackerDto";
import { dataResponseDto } from "../dtos/responseDto";
import prisma from "../prisma";
import { getPaging, PaginationResponse, sortDirection } from "../utils/pagination";

export const insert = async (expense: upsertExpenseRequestDto): Promise<Expense> => {
    const result: Expense | undefined = await prisma?.expense.create({
        data: {
            user_id: expense.userId,
            title: expense.title,
            amount: expense.amount,
            category: expense.category,
            currency: expense.currency,
            expense_date: expense.expense_date,
            type: expense.type,
            note: expense.note,
            is_deleted: false
        }
    });

    if(!result) throw new Error("Expense insertion failed");

    return result;
}

export const getExpenseByID = async (id: number, userId: number): Promise<Expense> => {
    const result: Expense | null | undefined = await prisma?.expense.findFirst({
        where: {
            id: id,
            user_id: userId,
            is_deleted: false
        }
    })

    if(!result) throw new Error("Expense not found");

    return result;
}

export const updateExpense = async (id: number , userId: number, expense: upsertExpenseRequestDto): Promise<Expense> => {
    const result: Expense | undefined = await prisma?.expense.update({
        where: {
            id: id,
            user_id: userId
        },
        data: {
            title: expense.title,
            amount: expense.amount,
            category: expense.category,
            currency: expense.currency,
            expense_date: expense.expense_date,
            type: expense.type,
            note: expense.note
        }
    });

    if(!result) throw new Error("Expense update failed");

    return result;
}

export const softDeleteExpense = async (id: number, userId: number): Promise<string> => {
    const result: Expense | undefined = await prisma?.expense.update({
        where: {
            id: id,
            user_id: userId
        },
        data: {
            is_deleted: true
        }
    });

    if(!result) throw new Error("Expense deletion failed");

    return dataResponseDto.Success;
}

export const hardDeleteExpense = async (id: number, userId: number): Promise<string> => {
    const result: Expense | undefined = await prisma?.expense.delete({
        where: {
            id: id,
            user_id: userId
        }
    });

    if(!result) throw new Error("Expense deletion failed");

    return dataResponseDto.Success;
}

export const getByPaging = async (page: number, pageSize: number, userId: number, year: number, month: number, sortDir: sortDirection = 'desc', q?: string, category?: string, type?: string): Promise<PaginationResponse<Expense>> => {

    const startDate = new Date(year, month -1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const whereClause = {
        user_id: userId,
        is_deleted: false,
        expense_date: {
            gte: startDate,
            lte: endDate
        },
        ...(q && {
            title: {
                contains: q,
                mode: 'insensitive' as const
            }
        }),
        ...(category && { category }),
        ...(type && { type })
    };

    const totalCount = await prisma.expense.count({
        where: whereClause
    });


   const expenses = await prisma.expense.findMany({
        where: whereClause,
        orderBy: {
            expense_date: sortDir === 'asc' ? 'asc' : 'desc'
        },
        skip: (page - 1) * pageSize,
        take: pageSize
    });

    const totalPage = Math.ceil(totalCount / pageSize);

    if(!expenses || expenses.length === 0) return {
            totalCount: 0,
            totalPage: 0,
            results: [],
            page,
            pageSize,
            hasNextPage: false,
            hasPrevPage: false
        };

    const result: PaginationResponse<Expense> = {
        totalCount,
        totalPage,
        page,
        pageSize,
        hasNextPage: page < totalPage,
        hasPrevPage: page > 1,
        results: expenses
    };

    return result;
}