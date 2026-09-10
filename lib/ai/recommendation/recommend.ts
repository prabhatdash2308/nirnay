import { ExtractedIntent } from "../intent/schemas";
import { RecommendationResult } from "./schemas";
import { MOCK_PRODUCTS } from "./mock-data";
import { rankProducts } from "./ranker";

export async function recommendProducts(intent: ExtractedIntent): Promise<RecommendationResult[]> {
  // In a real application, this would fetch verified products from a database or API
  // matching the general category before performing the rigorous deterministic ranking.
  
  // Here we use the mock products since no database of verified product facts exists yet.
  return rankProducts(intent, MOCK_PRODUCTS);
}
