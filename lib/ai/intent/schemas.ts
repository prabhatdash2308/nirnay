import { z } from "zod";

export const intentCategorySchema = z.enum([
  "health_insurance",
  "motor_insurance",
  "life_insurance",
  "other_insurance",
  "mutual_fund",
  "SIP",
  "other_investment",
  "emergency_fund",
  "education",
  "home",
  "retirement",
  "other_goal",
  "unknown"
]);

export const intentTypeSchema = z.enum([
  "insurance_discovery",
  "investment_discovery",
  "financial_goal",
  "product_comparison",
  "portfolio_review",
  "general_financial_question",
  "unknown"
]);

export const financialContextSchema = z.object({
  monthlyIncome: z.number().nullable().optional(),
  monthlyBudget: z.number().nullable().optional(),
  amount: z.number().nullable().optional(),
  timeHorizon: z.number().nullable().optional(), // in years or months, but numeric
  riskPreference: z.string().nullable().optional(),
});

export const extractedIntentSchema = z.object({
  intent: intentTypeSchema,
  category: intentCategorySchema,
  financialContext: financialContextSchema.optional().default({}),
  beneficiaries: z.array(z.string()).optional().default([]),
  requirements: z.array(z.string()).optional().default([]),
  missingInformation: z.array(z.string()).optional().default([]),
  confidence: z.number().min(0).max(1).optional()
});

export type ExtractedIntent = z.infer<typeof extractedIntentSchema>;
