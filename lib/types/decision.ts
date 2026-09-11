import { z } from "zod";

// Zod schema for the JSONB snapshot stored in decision_records
export const decisionContextSchema = z.object({
  productName: z.string(),
  productProvider: z.string(),
  tagline: z.string().optional(),
  whyItMatches: z.array(z.string()),
  cautions: z.array(z.string()),
  generalCautions: z.array(z.string()),
  summary: z.string().optional(),
  explanation: z.string().optional(),
});

export type DecisionContext = z.infer<typeof decisionContextSchema>;

// Represents a row in the decision_records table
export interface DecisionRecordRow {
  id: number;
  user_id: string;
  product_id: string;
  product_type: "insurance" | "investment";
  status: "saved" | "dismissed";
  suitability_score: number | null;
  decision_context: DecisionContext;
  created_at: string;
  updated_at: string;
}

// Input required to save a decision from the client
export const saveDecisionInputSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export type SaveDecisionInput = z.infer<typeof saveDecisionInputSchema>;
