import { ExpenseCategory } from "@/lib/financial/categories";

export interface Budget {
  id: number;
  user_id: string;
  category: ExpenseCategory;
  amount: number;
  period_month: number; // 1-12
  period_year: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBudgetInput {
  category: ExpenseCategory;
  amount: number;
  period_month: number;
  period_year: number;
}

export interface UpdateBudgetInput {
  id: number;
  amount: number;
}

export interface BudgetOverview {
  budget: Budget;
  spent: number;
  remaining: number;
  percentageUsed: number;
  status: "on_track" | "near_limit" | "over_budget";
}

export interface BudgetSummary {
  totalBudgeted: number;
  totalSpent: number;
  totalRemaining: number;
  categoriesOverBudget: number;
}
