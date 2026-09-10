import { Schema, SchemaType } from "@google/generative-ai";

export const explanationResponseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    summary: {
      type: SchemaType.STRING,
      description: "A short, plain-language summary of why the strongest match aligns with the profile (or a generic explanation if no profile).",
    },
    whyItMatches: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "List of reasons why the strongest match is suitable.",
    },
    whatToConsider: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Important limitations, cautions, or trade-offs for this option.",
    },
    questionsToAsk: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "1-2 critical questions the user should ask the provider before buying.",
    },
  },
  required: ["summary", "whyItMatches", "whatToConsider", "questionsToAsk"],
};

export type ExplanationResponse = {
  summary: string;
  whyItMatches: string[];
  whatToConsider: string[];
  questionsToAsk: string[];
};
