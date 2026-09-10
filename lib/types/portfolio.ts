import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Insurance Policies
// ─────────────────────────────────────────────────────────────────────────────

export const insurancePolicySchema = z.object({
  id: z.number(),
  user_id: z.string(),
  policy_type: z.enum(["health", "motor", "life", "other"]),
  provider: z.string(),
  policy_name: z.string(),
  policy_number: z.string().nullable(),
  premium_amount: z.number().nullable(),
  premium_frequency: z.enum(["monthly", "quarterly", "half_yearly", "yearly", "one_time"]).nullable(),
  sum_insured: z.number().nullable(),
  start_date: z.string().nullable(), // ISO date string
  renewal_date: z.string().nullable(), // ISO date string
  status: z.enum(["active", "expired", "cancelled", "pending"]),
  metadata: z.record(z.string(), z.any()).default({}),
  created_at: z.string(),
  updated_at: z.string(),
});

export type InsurancePolicy = z.infer<typeof insurancePolicySchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Investments
// ─────────────────────────────────────────────────────────────────────────────

export const investmentSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  investment_type: z.enum(["mutual_fund", "sip", "stock", "etf", "fd", "nps", "other"]),
  provider: z.string().nullable(),
  scheme_name: z.string(),
  amount: z.number().nullable(),
  frequency: z.enum(["monthly", "quarterly", "yearly", "one_time"]).nullable(),
  start_date: z.string().nullable(), // ISO date string
  status: z.enum(["active", "paused", "completed", "cancelled"]),
  metadata: z.record(z.string(), z.any()).default({}),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Investment = z.infer<typeof investmentSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Financial Goals
// ─────────────────────────────────────────────────────────────────────────────

export const financialGoalSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  name: z.string(),
  goal_type: z.enum(["emergency_fund", "retirement", "house", "car", "education", "travel", "custom"]),
  target_amount: z.number(),
  current_amount: z.number(),
  target_date: z.string().nullable(), // ISO date string
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["active", "completed", "paused", "cancelled"]),
  metadata: z.record(z.string(), z.any()).default({}),
  created_at: z.string(),
  updated_at: z.string(),
});

export type FinancialGoal = z.infer<typeof financialGoalSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Aggregate Portfolio Data
// ─────────────────────────────────────────────────────────────────────────────

export interface PortfolioData {
  policies: InsurancePolicy[];
  investments: Investment[];
  goals: FinancialGoal[];
}
