export type upsertExpenseRequestDto = {
    user_id: number,
    title: string,
    amount: number,
    category: string,
    currency: string,
    type: string,
    expense_date: Date,
    note: string
};