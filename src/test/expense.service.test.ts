import { PrismaClient, Expense, Prisma } from '@prisma/client';
import * as ExpenseService from '../service/expenseTrackerService';
import { upsertExpenseRequestDto } from '../dtos/expenseTrackerDto';
import { dataResponseDto } from '../dtos/responseDto';

const prisma = new PrismaClient();

describe('ExpenseService (Integration Tests)', () => {
  const getInsertExpenseDto = (): upsertExpenseRequestDto => ({
    user_id: 1,
    title: 'Test Expense',
    amount: 100.00,
    category: 'Food',
    currency: 'USD',
    type: 'Expense',
    expense_date: new Date(),
    note: 'Test note',
  });

  const getUpdateExpenseDto = (): upsertExpenseRequestDto => ({
    user_id: 1,
    title: 'Updated Expense',
    amount: 200.00,
    category: 'Food',
    currency: 'USD',
    type: 'Expense',
    expense_date: new Date(),
    note: 'Updated note',
  });

  let insertedExpense: Expense;

  beforeEach(async () => {
    await prisma.expense.deleteMany();
    insertedExpense = await prisma.expense.create({
      data: {
        user_id: 1,
        title: 'Test Expense',
        amount: new Prisma.Decimal(100.00),
        category: 'Food',
        currency: 'USD',
        expense_date: new Date(),
        note: 'Test note',
        is_deleted: false,
      },
    });
  });

  afterAll(async () => {
    await prisma.expense.deleteMany();
    await prisma.$disconnect();
  });

  test('should insert expense successfully', async () => {
    const dto = getInsertExpenseDto();
    const result = await ExpenseService.insert(dto);

    expect(result).toMatchObject({
      title: dto.title,
      amount: new Prisma.Decimal(dto.amount),
      category: dto.category,
      currency: dto.currency,
      note: dto.note,
    });

    expect(result.user_id).toBe(dto.user_id);
  });

  test('should get expense by ID successfully', async () => {
    const result = await ExpenseService.getExpenseByID(insertedExpense.id, 1);

    expect(result).not.toBeNull();
    expect(result?.id).toBe(insertedExpense.id);
    expect(result?.title).toBe(insertedExpense.title);
  });

  test('should update expense successfully', async () => {
    const dto = getUpdateExpenseDto();
    const result = await ExpenseService.updateExpense(insertedExpense.id, 1, dto);

    expect(result.title).toBe(dto.title);
    expect(result.amount?.toString()).toBe(dto.amount.toString());
    expect(result.note).toBe(dto.note);
  });

  test('should soft delete expense successfully', async () => {
    const result = await ExpenseService.softDeleteExpense(insertedExpense.id, 1);

    expect(result).toBe(dataResponseDto.Success);

    const deleted = await prisma.expense.findUnique({ where: { id: insertedExpense.id } });
    expect(deleted?.is_deleted).toBe(true);
  });

  test('should get paginated expenses successfully', async () => {
    const result = await ExpenseService.getByPaging(1, 10, 1, new Date().getFullYear(), new Date().getMonth() + 1);

    expect(result).not.toBeNull();
    expect(result?.results?.length).toBeGreaterThanOrEqual(1);
    expect(result?.results[0].user_id).toBe(1);
  });

  test('should hard delete expense successfully', async () => {
    const result = await ExpenseService.hardDeleteExpense(insertedExpense.id, 1);

    expect(result).toBe(dataResponseDto.Success);

    const deleted = await prisma.expense.findUnique({ where: { id: insertedExpense.id } });
    expect(deleted).toBeNull();
  });

  test('should return null when no expenses found', async () => {
    
    await prisma.expense.deleteMany();

    const result = await ExpenseService.getByPaging(1, 10, 1, 2025, 1);

    expect(result.results).toEqual([]);
  });
});
