import { z } from "zod";

export const explanationResponseSchema = {
  type: "object",
  properties: {
    summary: {
      type: "string",
      description: "A short, plain-language summary of why the strongest match aligns with the profile (or a generic explanation if no profile).",
    },
    whyItMatches: {
      type: "array",
      items: { type: "string" },
      description: "List of reasons why the strongest match is suitable.",
    },
    whatToConsider: {
      type: "array",
      items: { type: "string" },
      description: "Important limitations, cautions, or trade-offs for this option.",
    },
    questionsToAsk: {
      type: "array",
      items: { type: "string" },
      description: "1-2 critical questions the user should ask the provider before buying.",
    },
  },
  required: ["summary", "whyItMatches", "whatToConsider", "questionsToAsk"],
  additionalProperties: false,
};

export const ExplanationResponseValidator = z.object({
  summary: z.string(),
  whyItMatches: z.array(z.string()),
  whatToConsider: z.array(z.string()),
  questionsToAsk: z.array(z.string()),
});

export type ExplanationResponse = z.infer<typeof ExplanationResponseValidator>;
