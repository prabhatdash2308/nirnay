import { ExtractedIntent } from "../intent/schemas";
import { ProductData, RecommendationResult } from "./schemas";
import { scoreProduct } from "./scorer";

export function rankProducts(intent: ExtractedIntent, products: ProductData[]): RecommendationResult[] {
  const scoredProducts: RecommendationResult[] = [];

  for (const product of products) {
    const result = scoreProduct(intent, product);
    if (result) {
      scoredProducts.push(result);
    }
  }

  // Sort descending by score
  scoredProducts.sort((a, b) => b.score - a.score);

  // Assign ranks
  scoredProducts.forEach((res, idx) => {
    res.rank = idx + 1;
  });

  return scoredProducts;
}
