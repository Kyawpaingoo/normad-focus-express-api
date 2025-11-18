import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Expense } from '@prisma/client';
import { UpsertExpenseDto } from './dto/upsert-expense.dto';
import { PaginationResponse, sortDirection } from '../../common/types/pagination.types';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

@Injectable()
export class ExpenseService {
  constructor(private prisma: PrismaService) {}

  async insert(data: UpsertExpenseDto): Promise<Expense> {
    const result = await this.prisma.expense.create({
      data: {
        ...data,
        is_deleted: false,
      },
    });

    if (!result) {
      throw new BadRequestException('Expense insertion failed');
    }

    return result;
  }

  async getExpenseByID(id: number, userId: number): Promise<Expense> {
    const result = await this.prisma.expense.findFirst({
      where: {
        id: id,
        user_id: userId,
        is_deleted: false,
      },
    });

    if (!result) {
      throw new NotFoundException('Expense not found');
    }

    return result;
  }

  async updateExpense(id: number, userId: number, expense: UpsertExpenseDto): Promise<Expense> {
    const result = await this.prisma.expense.update({
      where: {
        id: id,
        user_id: userId,
      },
      data: {
        ...expense,
      },
    });

    if (!result) {
      throw new BadRequestException('Expense update failed');
    }

    return result;
  }

  async softDeleteExpense(id: number, userId: number): Promise<string> {
    const result = await this.prisma.expense.update({
      where: {
        id: id,
        user_id: userId,
      },
      data: {
        is_deleted: true,
      },
    });

    if (!result) {
      throw new BadRequestException('Expense deletion failed');
    }

    return 'Expense deleted successfully';
  }

  async hardDeleteExpense(id: number, userId: number): Promise<string> {
    const result = await this.prisma.expense.delete({
      where: {
        id: id,
        user_id: userId,
      },
    });

    if (!result) {
      throw new BadRequestException('Expense deletion failed');
    }

    return 'Expense deleted successfully';
  }

  async getByPaging(
    page: number,
    pageSize: number,
    userId: number,
    year: number,
    month: number,
    sortDir: sortDirection = 'desc',
    q?: string,
    category?: string,
    type?: string,
  ): Promise<PaginationResponse<Expense>> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const whereClause = {
      user_id: userId,
      is_deleted: false,
      expense_date: {
        gte: startDate,
        lte: endDate,
      },
      ...(q && {
        title: {
          contains: q,
          mode: 'insensitive' as const,
        },
      }),
      ...(category && { category }),
      ...(type && { type }),
    };

    const totalCount = await this.prisma.expense.count({
      where: whereClause,
    });

    const expenses = await this.prisma.expense.findMany({
      where: whereClause,
      orderBy: {
        expense_date: sortDir === 'asc' ? 'asc' : 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPage = Math.ceil(totalCount / pageSize);

    if (!expenses || expenses.length === 0) {
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

    const expenseBreakdown = await this.generateExpenseBreakdown(userId, year, month);

    const incomeVsExpense = await this.generateIncomeVsExpense(userId, year, month);

    const additionalData = {
      expenseBreakdown,
      incomeVsExpense,
    };

    const result: PaginationResponse<Expense> = {
      totalCount,
      totalPage,
      page,
      pageSize,
      hasNextPage: page < totalPage,
      hasPrevPage: page > 1,
      results: expenses,
      additionalData: JSON.stringify(additionalData),
    };

    return result;
  }

  private async generateExpenseBreakdown(userId: number, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;

    const prevStartDate = new Date(prevYear, prevMonth - 1, 1);
    const prevEndDate = new Date(prevYear, prevMonth, 0, 23, 59, 59);

    const currentExpenses = await this.prisma.expense.groupBy({
      by: ['category'],
      where: {
        user_id: userId,
        is_deleted: false,
        expense_date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const prevExpenses = await this.prisma.expense.groupBy({
      by: ['category'],
      where: {
        user_id: userId,
        is_deleted: false,
        expense_date: {
          gte: prevStartDate,
          lte: prevEndDate,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const currentTotal = currentExpenses.reduce((sum, item) => sum + Number(item._sum.amount || 0), 0);
    const prevTotal = prevExpenses.reduce((sum, item) => sum + Number(item._sum.amount || 0), 0);

    const change = prevTotal > 0 ? Math.round(((currentTotal - prevTotal) / prevTotal) * 100) : 0;

    const categories = currentExpenses.map((item) => ({
      label: item.category,
      value: Number(item._sum.amount || 0),
    }));

    return {
      total: currentTotal,
      change,
      categories,
    };
  }

  private async generateIncomeVsExpense(userId: number, year: number, currentMonth: number) {
    const values: number[] = [];
    const monthLabels: string[] = [];

    for (let month = 1; month <= currentMonth; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const expenseResult =
        (await this.prisma.expense.aggregate({
          where: {
            user_id: userId,
            is_deleted: false,
            type: 'expense',
            expense_date: {
              gte: startDate,
              lte: endDate,
            },
          },
          _sum: {
            amount: true,
          },
        })) || { _sum: { amount: 0 } };

      const incomeResult =
        (await this.prisma.expense.aggregate({
          where: {
            user_id: userId,
            is_deleted: false,
            type: 'income',
            expense_date: {
              gte: startDate,
              lte: endDate,
            },
          },
          _sum: {
            amount: true,
          },
        })) || { _sum: { amount: 0 } };

      const expense = Number(expenseResult._sum.amount || 0);
      const income = Number(incomeResult._sum.amount || 0);
      const netAmount = income - expense;

      values.push(netAmount);
      monthLabels.push(months[month - 1]);
    }

    const currentValue = values[values.length - 1] || 0;
    const previousValue = values[values.length - 2] || 0;
    const change = previousValue > 0 ? Math.round(((currentValue - previousValue) / previousValue) * 100) : 0;

    return {
      total: currentValue,
      change,
      months: monthLabels,
      values,
    };
  }
}
