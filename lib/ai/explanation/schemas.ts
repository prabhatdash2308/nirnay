import { z } from "zod";

export const explanationResultSchema = z.object({
  summary: z.string(),
  whyThisRanksHigher: z.array(z.string()),
  tradeOffs: z.array(z.string()),
  unmetRequirements: z.array(z.string()),
  missingInformation: z.array(z.string()),
  verificationNotes: z.array(z.string()),
});

export type ExplanationResult = z.infer<typeof explanationResultSchema>;
