export type IncomeFrequency =
  | "monthly"
  | "weekly"
  | "biweekly"
  | "yearly"
  | "irregular";

export type FinancialGoal = {
  id: string | number; // string for unpersisted client goals (UUID), number for persisted goals
  name: string;
  targetAmount: number;
  targetDate?: string; // YYYY-MM-DD format
};

export type FixedCommitments = {
  rent: number;
  utilities: number;
  other: number;
};

export type OnboardingData = {
  displayName: string;
  currency: string;
  incomeAmount: number | null;
  incomeFrequency: IncomeFrequency | null;
  fixedCommitments: FixedCommitments;
};
