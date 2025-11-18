import { Expense } from "@prisma/client";
import { upsertExpenseRequestDto } from "../dtos/expenseTrackerDto";
import { PaginationResponse, sortDirection } from "../utils/pagination";
export declare const insert: (data: upsertExpenseRequestDto) => Promise<Expense>;
export declare const getExpenseByID: (id: number, userId: number) => Promise<Expense>;
export declare const updateExpense: (id: number, userId: number, expense: upsertExpenseRequestDto) => Promise<Expense>;
export declare const softDeleteExpense: (id: number, userId: number) => Promise<string>;
export declare const hardDeleteExpense: (id: number, userId: number) => Promise<string>;
export declare const getByPaging: (page: number, pageSize: number, userId: number, year: number, month: number, sortDir?: sortDirection, q?: string, category?: string, type?: string) => Promise<PaginationResponse<Expense>>;
