import { Request, Response } from "express"
import * as expenseService from "../service/expenseTrackerService"
import { upsertExpenseRequestDto } from "../dtos/expenseTrackerDto";
import { errorResponse, successResponse } from "../utils/jsonResponse";
import { sortDirection } from "../utils/pagination";
import { PaginationResponse } from "../utils/pagination";
import { Expense } from "@prisma/client";

export const insertExpense = async (req: Request, res: Response) : Promise<void> => {
    try {
        const result = await expenseService.insert(req.body as upsertExpenseRequestDto);

        successResponse(res, result, "Expense inserted successfully");
    }
    catch(error: any) {
        errorResponse(error as Error, 400, error.message, res);
    }
}

export const getByID = async (req: Request, res: Response) : Promise<void> => {
    try {
        const {id, userId} = req.params;
        const result = await expenseService.getExpenseByID(parseInt(id), parseInt(userId));
        successResponse(res, result, "Expense details fetched successfully");
    }
    catch(error: any) {
        errorResponse(error as Error, 400, error.message, res);
    }
}

export const updateExpense = async (req: Request, res: Response) : Promise<void> => {
    try {
        const {id, userId} = req.params;
        const result = await expenseService.updateExpense(parseInt(id), parseInt(userId), req.body as upsertExpenseRequestDto);
        successResponse(res, result, "Expense updated successfully");
    }
    catch(error: any) {
        errorResponse(error as Error, 400, error.message, res);
    }
}

export const getByPaging = async (req: Request, res: Response) : Promise<void> => {
    try {
        const {page, pageSize, userId, year, month, sortDir, q, category, type} = req.params;

        const result: PaginationResponse<Expense> = await expenseService.getByPaging(parseInt(page), parseInt(pageSize), parseInt(userId), parseInt(year), parseInt(month), sortDir as sortDirection, q, category, type);

        successResponse(res, result, "Expense details fetched successfully");
    }
    catch(error: any) {
        errorResponse(error as Error, 400, error.message, res);
    }
}

export const softDeleteExpense = async (req: Request, res: Response) : Promise<void> => {
    try {
        const {id, userId} = req.params;
        const result = await expenseService.softDeleteExpense(parseInt(id), parseInt(userId));
        successResponse(res, result, "Expense deleted successfully");
    }
    catch(error: any) {
        errorResponse(error as Error, 400, error.message, res);
    }
}

export const hardDeleteExpense = async (req: Request, res: Response) : Promise<void> => {
    try {
        const {id, userId} = req.params;
        const result = await expenseService.hardDeleteExpense(parseInt(id), parseInt(userId));
        successResponse(res, result, "Expense deleted successfully");
    }
    catch(error: any) {
        errorResponse(error as Error, 400, error.message, res);
    }
}