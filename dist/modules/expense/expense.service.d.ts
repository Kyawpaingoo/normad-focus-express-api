import { PrismaService } from '../../database/prisma.service';
import { Expense } from '@prisma/client';
import { UpsertExpenseDto } from './dto/upsert-expense.dto';
import { PaginationResponse, sortDirection } from '../../common/types/pagination.types';
export declare class ExpenseService {
    private prisma;
    constructor(prisma: PrismaService);
    insert(data: UpsertExpenseDto): Promise<Expense>;
    getExpenseByID(id: number, userId: number): Promise<Expense>;
    updateExpense(id: number, userId: number, expense: UpsertExpenseDto): Promise<Expense>;
    softDeleteExpense(id: number, userId: number): Promise<string>;
    hardDeleteExpense(id: number, userId: number): Promise<string>;
    getByPaging(page: number, pageSize: number, userId: number, year: number, month: number, sortDir?: sortDirection, q?: string, category?: string, type?: string): Promise<PaginationResponse<Expense>>;
    private generateExpenseBreakdown;
    private generateIncomeVsExpense;
}
