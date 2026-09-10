import { NextResponse } from "next/server";
import { z } from "zod";

const NON_NEGATIVE_NUMERIC = (field: string) =>
  z
    .number()
    .nonnegative(`${field} must be non-negative.`)
    .nullable()
    .optional()
    .or(z.literal("").transform(() => null))
    .or(z.null());

const POSITIVE_NUMERIC = (field: string) =>
  z
    .number()
    .positive(`${field} must be positive.`)
    .nullable()
    .optional();

// ============================================================
// user_profiles
// ============================================================
export const userProfileUpsertSchema = z.object({
  full_name: z.string().max(200).trim().optional().nullable(),
  email: z.string().email("Invalid email format.").max(320).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  avatar_url: z.string().url("Invalid avatar URL.").max(500).optional().nullable(),
});

// ============================================================
// financial_profiles
// ============================================================
export const financialProfileUpsertSchema = z.object({
  monthly_income: NON_NEGATIVE_NUMERIC("Monthly income"),
  monthly_expenses: NON_NEGATIVE_NUMERIC("Monthly expenses"),
  monthly_investment_budget: NON_NEGATIVE_NUMERIC("Monthly investment budget"),
  annual_insurance_budget: NON_NEGATIVE_NUMERIC("Annual insurance budget"),
  risk_profile: z
    .enum(["conservative", "moderate", "aggressive"])
    .optional()
    .nullable(),
  financial_experience: z
    .enum(["beginner", "intermediate", "advanced"])
    .optional()
    .nullable(),
  primary_goals: z.array(z.string().max(100)).default([]).optional(),
});

// ============================================================
// insurance_policies
// ============================================================
export const insurancePolicyCreateSchema = z.object({
  policy_type: z.enum(["health", "motor", "life", "other"]),
  provider: z.string().min(2, "Provider name is too short.").max(200),
  policy_name: z.string().min(2, "Policy name is too short.").max(300),
  policy_number: z.string().max(100).optional().nullable(),
  premium_amount: NON_NEGATIVE_NUMERIC("Premium amount"),
  premium_frequency: z
    .enum(["monthly", "quarterly", "half_yearly", "yearly", "one_time"])
    .optional()
    .nullable(),
  sum_insured: NON_NEGATIVE_NUMERIC("Sum insured"),
  start_date: z.coerce.date().optional().nullable(),
  renewal_date: z.coerce.date().optional().nullable(),
  status: z.enum(["active", "expired", "cancelled", "pending"]).default("active"),
  metadata: z.record(z.string(), z.any()).default({}).optional(),
});

export const insurancePolicyUpdateSchema = insurancePolicyCreateSchema.partial();

// ============================================================
// investments
// ============================================================
export const investmentCreateSchema = z.object({
  investment_type: z.enum([
    "mutual_fund",
    "sip",
    "stock",
    "etf",
    "fd",
    "nps",
    "other",
  ]),
  provider: z.string().max(200).optional().nullable(),
  scheme_name: z.string().min(1, "Scheme name is required.").max(300),
  amount: NON_NEGATIVE_NUMERIC("Amount"),
  frequency: z
    .enum(["monthly", "quarterly", "yearly", "one_time"])
    .optional()
    .nullable(),
  start_date: z.coerce.date().optional().nullable(),
  status: z
    .enum(["active", "paused", "completed", "cancelled"])
    .default("active"),
  metadata: z.record(z.string(), z.any()).default({}).optional(),
});

export const investmentUpdateSchema = investmentCreateSchema.partial();

// ============================================================
// financial_goals
// ============================================================
export const financialGoalCreateSchema = z.object({
  name: z.string().min(1, "Goal name is required.").max(200),
  goal_type: z
    .enum([
      "emergency_fund",
      "retirement",
      "house",
      "car",
      "education",
      "travel",
      "custom",
    ])
    .default("custom"),
  target_amount: z
    .number()
    .positive("Target amount must be positive."),
  current_amount: z
    .number()
    .nonnegative("Current amount cannot be negative.")
    .default(0)
    .optional(),
  target_date: z.coerce.date().optional().nullable(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z
    .enum(["active", "completed", "paused", "cancelled"])
    .default("active"),
  metadata: z.record(z.string(), z.any()).default({}).optional(),
});

export const financialGoalUpdateSchema = financialGoalCreateSchema.partial();

// ============================================================
// watchlist
// ============================================================
export const watchlistAddSchema = z.object({
  product_type: z.enum(["insurance", "mutual_fund", "investment", "other"]),
  product_id: z.string().min(1, "Product ID is required.").max(200),
});

// ============================================================
// alerts
// ============================================================
export const alertCreateSchema = z.object({
  alert_type: z.enum([
    "insurance_renewal",
    "premium_payment",
    "sip_reminder",
    "portfolio_event",
    "goal_progress",
    "product_update",
    "system",
    "other",
  ]),
  title: z.string().min(1, "Title is required.").max(200),
  message: z.string().min(1, "Message is required.").max(2000),
  severity: z
    .enum(["info", "warning", "important", "critical"])
    .default("info"),
  scheduled_for: z.coerce.date().optional().nullable(),
  metadata: z.record(z.string(), z.any()).default({}).optional(),
});

export const alertUpdateSchema = z.object({
  read_at: z.coerce.date().optional().nullable(),
  severity: z
    .enum(["info", "warning", "important", "critical"])
    .optional(),
  title: z.string().min(1).max(200).optional(),
  message: z.string().min(1).max(2000).optional(),
});

// ============================================================
// financial_calendar
// ============================================================
export const calendarEventCreateSchema = z.object({
  event_type: z.enum([
    "insurance_renewal",
    "premium_payment",
    "sip",
    "goal_milestone",
    "investment_review",
    "other",
  ]),
  title: z.string().min(1, "Title is required.").max(200),
  description: z.string().max(2000).optional().nullable(),
  event_date: z.coerce.date(),
  status: z
    .enum(["upcoming", "completed", "skipped", "cancelled"])
    .default("upcoming"),
  metadata: z.record(z.string(), z.any()).default({}).optional(),
});

export const calendarEventUpdateSchema = calendarEventCreateSchema.partial();

// ============================================================
// Query / List parameters
// ============================================================
export const listQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(500).default(100).optional(),
  offset: z.coerce.number().int().nonnegative().default(0).optional(),
  status: z.string().max(50).optional(),
  sort_by: z.string().max(50).optional(),
  sort_order: z.enum(["asc", "desc"]).default("desc").optional(),
  search: z.string().max(100).optional(),
});

// ============================================================
// Product catalog queries
// ============================================================
export const insuranceCatalogQuerySchema = z.object({
  product_type: z.enum(["health", "motor", "life"]).optional(),
  provider: z.string().max(100).optional(),
  max_premium: z.coerce.number().nonnegative().optional(),
  min_sum_insured: z.coerce.number().positive().optional(),
  limit: z.coerce.number().int().positive().max(200).default(50).optional(),
});

export const mutualFundCatalogQuerySchema = z.object({
  fund_category: z
    .enum([
      "equity",
      "debt",
      "hybrid",
      "index",
      "elss",
      "liquid",
      "gold",
      "other",
    ])
    .optional(),
  risk_level: z
    .enum([
      "low",
      "moderately_low",
      "moderate",
      "moderately_high",
      "high",
      "very_high",
    ])
    .optional(),
  max_sip_amount: z.coerce.number().nonnegative().optional(),
  min_returns_1y: z.coerce.number().optional(),
  limit: z.coerce.number().int().positive().max(200).default(50).optional(),
});

// ============================================================
// Recommendation / Comparison
// ============================================================
export const insuranceCompareRequestSchema = z.object({
  product_keys: z.array(z.string().min(1).max(100)).min(2).max(4),
  user_age: z.coerce.number().int().positive().optional(),
  annual_budget: z.coerce.number().nonnegative().optional(),
  sum_insured_target: z.coerce.number().positive().optional(),
});

export const insuranceRecommendRequestSchema = z.object({
  product_type: z.enum(["health", "motor", "life"]),
  user_age: z.coerce.number().int().positive().optional(),
  annual_budget: z.coerce.number().nonnegative().optional(),
  sum_insured_target: z.coerce.number().positive().optional(),
  risk_preference: z
    .enum(["conservative", "moderate", "aggressive"])
    .optional(),
  must_have_features: z.array(z.string().max(100)).default([]).optional(),
  limit: z.coerce.number().int().positive().max(10).default(5).optional(),
});

export const mutualFundRecommendRequestSchema = z.object({
  investment_type: z.enum(["lumpsum", "sip"]).default("sip"),
  monthly_investment: z.coerce.number().positive().optional(),
  risk_preference: z
    .enum(["conservative", "moderate", "aggressive"])
    .optional(),
  investment_horizon_years: z.coerce.number().positive().optional(),
  tax_saving_elss: z.boolean().default(false).optional(),
  limit: z.coerce.number().int().positive().max(10).default(5).optional(),
});

export const mutualFundCompareRequestSchema = z.object({
  product_keys: z.array(z.string().min(1).max(100)).min(2).max(4),
});

export function parseOrError<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): z.infer<T> | NextResponse {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    return NextResponse.json(
      {
        error: "Validation failed.",
        details: issues,
      },
      { status: 400 },
    );
  }
  return result.data;
}
