import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Input Schemas (shared between client forms and server actions)
// ─────────────────────────────────────────────────────────────────────────────

export const addPolicyInputSchema = z.object({
  policy_type: z.enum(["health", "motor", "life", "other"]),
  provider: z.string().min(1, "Provider is required").max(200),
  policy_name: z.string().min(1, "Policy name is required").max(200),
  policy_number: z.string().max(100).optional(),
  premium_amount: z.number().nonnegative("Premium must be non-negative").optional(),
  premium_frequency: z.enum(["monthly", "quarterly", "half_yearly", "yearly", "one_time"]).optional(),
  sum_insured: z.number().nonnegative("Sum insured must be non-negative").optional(),
  start_date: z.string().optional(),   // ISO date string "YYYY-MM-DD"
  renewal_date: z.string().optional(), // ISO date string "YYYY-MM-DD"
  status: z.enum(["active", "expired", "cancelled", "pending"]).default("active"),
});
export type AddPolicyInput = z.infer<typeof addPolicyInputSchema>;

export const addInvestmentInputSchema = z.object({
  investment_type: z.enum(["mutual_fund", "sip", "stock", "etf", "fd", "nps", "other"]),
  provider: z.string().max(200).optional(),
  scheme_name: z.string().min(1, "Name is required").max(200),
  amount: z.number().nonnegative("Amount must be non-negative").optional(),
  frequency: z.enum(["monthly", "quarterly", "yearly", "one_time"]).optional(),
  start_date: z.string().optional(), // ISO date string "YYYY-MM-DD"
  status: z.enum(["active", "paused", "completed", "cancelled"]).default("active"),
});
export type AddInvestmentInput = z.infer<typeof addInvestmentInputSchema>;

export const addGoalInputSchema = z.object({
  name: z.string().min(1, "Goal name is required").max(200),
  goal_type: z.enum(["emergency_fund", "retirement", "house", "car", "education", "travel", "custom"]),
  target_amount: z.number().positive("Target amount must be greater than 0"),
  current_amount: z.number().nonnegative("Current amount must be non-negative"),
  target_date: z.string().optional(), // ISO date string "YYYY-MM-DD"
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z.enum(["active", "completed", "paused", "cancelled"]).default("active"),
});
export type AddGoalInput = z.infer<typeof addGoalInputSchema>;
