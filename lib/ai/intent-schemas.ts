/**
 * lib/ai/intent-schemas.ts
 *
 * Zod schemas for AI intent extraction and enhanced explanation output.
 *
 * Integrated from Ananya Chaudhary's AI foundation (origin/feature/ai-foundation).
 *
 * These schemas are additive — they do NOT replace or modify the existing
 * ExplanationResponseValidator in lib/ai/schemas.ts, which remains the public
 * contract for the current explain-decision API route and its consumers.
 *
 * The enhanced schema (EnhancedExplanationResultSchema) targets the
 * ENHANCED_EXPLAIN_SYSTEM_PROMPT and is intended for future routes that adopt
 * the richer explanation format.
 */

import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Intent extraction schemas
// ─────────────────────────────────────────────────────────────────────────────

/** The high-level intent of the user's query. */
export const intentTypeSchema = z.enum([
  "insurance_discovery",
  "investment_discovery",
  "financial_goal",
  "product_comparison",
  "portfolio_review",
  "general_financial_question",
  "unknown",
]);

export type IntentType = z.infer<typeof intentTypeSchema>;

/** The product/goal category the user is asking about. */
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
  "unknown",
]);

export type IntentCategory = z.infer<typeof intentCategorySchema>;

/**
 * Financial context extracted from the user's message.
 * All fields are nullable — they are only populated when explicitly stated.
 * The AI must NEVER infer or estimate these values.
 */
export const financialContextSchema = z.object({
  monthlyIncome: z.number().nullable().optional(),
  monthlyBudget: z.number().nullable().optional(),
  /** Lump-sum or goal amount stated by the user. */
  amount: z.number().nullable().optional(),
  /** Investment/planning horizon in years. */
  timeHorizon: z.number().nullable().optional(),
  /** Free-text risk preference (e.g. "low", "aggressive"). */
  riskPreference: z.string().nullable().optional(),
});

export type FinancialContext = z.infer<typeof financialContextSchema>;

/**
 * The complete structured intent extracted from a user's natural-language query.
 * This is the input to the deterministic suitability engine.
 *
 * Trust guarantees:
 *   - All fields reflect only what the user explicitly stated.
 *   - missingInformation lists what the engine could not determine.
 *   - confidence is the AI's self-assessed parsing certainty (NOT a financial prediction).
 */
export const extractedIntentSchema = z.object({
  intent: intentTypeSchema,
  category: intentCategorySchema,
  financialContext: financialContextSchema.optional().default({}),
  beneficiaries: z.array(z.string()).optional().default([]),
  requirements: z.array(z.string()).optional().default([]),
  missingInformation: z.array(z.string()).optional().default([]),
  /** 0.0–1.0. Reflects interpretation confidence, NOT financial certainty. */
  confidence: z.number().min(0).max(1).optional(),
});

export type ExtractedIntent = z.infer<typeof extractedIntentSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Enhanced explanation result schema
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The output schema for ENHANCED_EXPLAIN_SYSTEM_PROMPT.
 *
 * This schema provides richer granularity than the current ExplanationResponse
 * in lib/ai/schemas.ts. It is NOT yet consumed by the explain-decision route —
 * that route retains the existing schema for backwards compatibility. Future
 * routes adopting the enhanced explanation flow should use this schema.
 *
 * Field mapping vs current schema:
 *   whyThisRanksHigher  ≈ whyItMatches   (more precise — rank-aware)
 *   tradeOffs           ≈ whatToConsider  (more precise — explicit trade-off label)
 *   unmetRequirements   NEW — requirements the product could not meet
 *   missingInformation  NEW — data gaps that prevented full scoring
 *   verificationNotes   ≈ questionsToAsk  (reframed as verification steps)
 */
export const enhancedExplanationResultSchema = z.object({
  summary: z.string(),
  whyThisRanksHigher: z.array(z.string()),
  tradeOffs: z.array(z.string()),
  unmetRequirements: z.array(z.string()),
  missingInformation: z.array(z.string()),
  verificationNotes: z.array(z.string()),
});

export type EnhancedExplanationResult = z.infer<
  typeof enhancedExplanationResultSchema
>;
