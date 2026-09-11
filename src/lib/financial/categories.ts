export const EXPENSE_CATEGORIES = [
  "Housing",
  "Food",
  "Transportation",
  "Utilities",
  "Healthcare",
  "Shopping",
  "Entertainment",
  "Education",
  "Travel",
  "Subscriptions",
  "Personal",
  "Other"
] as const;

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Interest",
  "Other"
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export type IncomeCategory = typeof INCOME_CATEGORIES[number];
export type TransactionCategory = ExpenseCategory | IncomeCategory;

export function getCategoriesForType(type: "income" | "expense"): readonly string[] {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}
