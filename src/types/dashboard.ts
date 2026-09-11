import { Transaction } from "./transaction";
import { BudgetOverview, BudgetSummary } from "./budget";

export type DashboardFinancialProfile = {
  baseCurrency: string;
  monthlyIncome: number | null;
  monthlyExpenses: number | null;
};

export type DashboardGoal = {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string | null;
  status: string;
};

export type DashboardData = {
  fullName: string | null;
  financialProfile: DashboardFinancialProfile;
  goals: DashboardGoal[];
  transactions: Transaction[];
  budgetStatus: {
    summary: BudgetSummary;
    overviews: BudgetOverview[];
  } | null;
};
