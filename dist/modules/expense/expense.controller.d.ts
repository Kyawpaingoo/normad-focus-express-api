import { Response } from 'express';
import { ExpenseService } from './expense.service';
import { UpsertExpenseDto } from './dto/upsert-expense.dto';
export declare class ExpenseController {
    private readonly expenseService;
    constructor(expenseService: ExpenseService);
    insertExpense(expenseDto: UpsertExpenseDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getByID(id: number, userId: number, res: Response): Promise<Response<any, Record<string, any>>>;
    updateExpense(id: number, userId: number, expenseDto: UpsertExpenseDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getByPaging(query: any, res: Response): Promise<Response<any, Record<string, any>>>;
    softDeleteExpense(id: number, userId: number, res: Response): Promise<Response<any, Record<string, any>>>;
    hardDeleteExpense(id: number, userId: number, res: Response): Promise<Response<any, Record<string, any>>>;
}
