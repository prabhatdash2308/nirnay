import { z } from "zod";

// ─────────────────────────────────────────────────────────────
// Risk profile and financial experience enums
// Must match database CHECK constraints exactly.
// ─────────────────────────────────────────────────────────────

export const RISK_PROFILES = ["conservative", "moderate", "aggressive"] as const;
export const FINANCIAL_EXPERIENCES = ["beginner", "intermediate", "advanced"] as const;

// Keep in sync with database goal labels.
// Stored as text[] — no target amounts or deadlines here.
export const PRIMARY_GOAL_OPTIONS = [
  { value: "emergency_fund", label: "Emergency fund" },
  { value: "buy_car", label: "Buy a car" },
  { value: "buy_home", label: "Buy a home" },
  { value: "retirement", label: "Retirement" },
  { value: "education", label: "Education" },
  { value: "travel", label: "Travel" },
  { value: "build_wealth", label: "Build wealth" },
  { value: "protect_family", label: "Protect my family" },
] as const;

export type PrimaryGoalValue = (typeof PRIMARY_GOAL_OPTIONS)[number]["value"];
export type RiskProfile = (typeof RISK_PROFILES)[number];
export type FinancialExperience = (typeof FINANCIAL_EXPERIENCES)[number];

// ─────────────────────────────────────────────────────────────
// Zod schema — aligned with DB constraints
// ─────────────────────────────────────────────────────────────

export const financialProfileSchema = z.object({
  monthly_income: z
    .number({ error: "Enter a valid amount" })
    .nonnegative("Monthly income cannot be negative")
    .nullable(),

  monthly_expenses: z
    .number({ error: "Enter a valid amount" })
    .nonnegative("Monthly expenses cannot be negative")
    .nullable(),

  monthly_investment_budget: z
    .number({ error: "Enter a valid amount" })
    .nonnegative("Investment budget cannot be negative")
    .nullable(),

  annual_insurance_budget: z
    .number({ error: "Enter a valid amount" })
    .nonnegative("Insurance budget cannot be negative")
    .nullable(),

  financial_experience: z.enum(FINANCIAL_EXPERIENCES).nullable(),

  risk_profile: z.enum(RISK_PROFILES).nullable(),

  primary_goals: z.array(z.string()),
});

export type FinancialProfileInput = z.infer<typeof financialProfileSchema>;

// ─────────────────────────────────────────────────────────────
// Row as returned from Supabase
// ─────────────────────────────────────────────────────────────

export interface FinancialProfileRow extends FinancialProfileInput {
  id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}
