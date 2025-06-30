export type upsertExpenseRequestDto = {
    userId: number,
    title: string,
    amount: number,
    category: string,
    currency: string,
    type: string,
    expense_date: Date,
    note: string
};