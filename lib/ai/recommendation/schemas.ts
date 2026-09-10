import { z } from "zod";

export const productDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  premium: z.number().nullable(), // Monthly cost or minimum investment
  coverageAmount: z.number().nullable(),
  features: z.array(z.string()),
  exclusions: z.array(z.string()),
  riskLevel: z.string().nullable(),
  isMock: z.boolean().default(true),
});

export type ProductData = z.infer<typeof productDataSchema>;

export const scoreBreakdownSchema = z.object({
  budgetFit: z.number(),
  requirementFit: z.number(),
  goalAlignment: z.number(),
  riskAlignment: z.number(),
});

export const recommendationResultSchema = z.object({
  productId: z.string(),
  score: z.number(),
  rank: z.number(),
  matchedRequirements: z.array(z.string()),
  tradeOffs: z.array(z.string()),
  unmetRequirements: z.array(z.string()),
  missingInformation: z.array(z.string()),
  scoreBreakdown: scoreBreakdownSchema,
});

export type RecommendationResult = z.infer<typeof recommendationResultSchema>;
