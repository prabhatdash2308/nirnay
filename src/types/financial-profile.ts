import { IncomeFrequency } from "./onboarding";

export type DbUserProfile = {
  user_id: string;
  full_name: string | null;
};

export type DbFinancialProfile = {
  user_id: string;
  base_currency: string;
  base_income_amount: number | null;
  base_income_frequency: IncomeFrequency | null;
  monthly_income: number | null;
  monthly_expenses: number | null;
};

export type DbFinancialGoal = {
  user_id: string;
  name: string;
  target_amount: number;
  target_date: string | null;
};

export type FullFinancialProfile = {
  fullName: string | null;
  email: string | null;
  baseCurrency: string;
  baseIncomeAmount: number | null;
  baseIncomeFrequency: IncomeFrequency | null;
  monthlyIncome: number | null;
  monthlyExpenses: number | null;
};

export type UpdateFinancialProfileInput = {
  fullName: string | null;
  baseCurrency: string;
  baseIncomeAmount: number | null;
  baseIncomeFrequency: IncomeFrequency | null;
  monthlyExpenses: number | null;
};
