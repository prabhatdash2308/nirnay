// ─────────────────────────────────────────────────────────────────────────────
// NIRNAY — Decision Support Logic
//
// Generates a deterministic decision summary based on product catalogue facts
// and the user's financial profile.
//
// DESIGN PRINCIPLES:
// - Deterministic: Always produces the same output for the same inputs.
// - Fact-based: Never invents statistics or prices.
// - Transparent: Clearly separates suitability score from factual data.
// - Non-advisory: Explains *why* a product matches the profile, without
//   offering guarantees or financial advice.
// ─────────────────────────────────────────────────────────────────────────────

import type { Product } from "@/lib/types/product";
import type { FinancialProfileInput } from "@/lib/types/financial-profile";
import { computeSuitability } from "@/lib/suitability/engine";
import type { SuitabilityResult } from "@/lib/suitability/engine";

export interface EvaluatedProduct {
  product: Product;
  suitability: SuitabilityResult;
  whyMatches: string[];
  cautions: string[];
}

export interface DecisionGuidance {
  /** True if a profile was provided and used */
  hasProfile: boolean;
  /** The product with the highest suitability score (or the only product) */
  strongestMatch: EvaluatedProduct | null;
  /** The remaining products sorted by score descending */
  otherProducts: EvaluatedProduct[];
  /** High-level cautions about the comparison set */
  generalCautions: string[];
  /** True if there is a tie for the strongest match */
  hasTie: boolean;
}

export const GENERAL_CAUTIONS = [
  "This tool provides heuristic guidance based on your stated profile, not regulated financial advice.",
  "Financial figures (premiums, SIPs, expense ratios) are indicative reference data.",
  "Always verify actual pricing, eligibility, and terms with the product provider before deciding.",
];

/**
 * Generate a structured decision explanation for a set of products.
 *
 * @param products - The comparison set (1-3 products)
 * @param profile - The user's financial profile, if available
 */
export function generateDecisionGuidance(
  products: Product[],
  profile: FinancialProfileInput | null
): DecisionGuidance {
  if (products.length === 0) {
    return {
      hasProfile: profile !== null,
      strongestMatch: null,
      otherProducts: [],
      generalCautions: GENERAL_CAUTIONS,
      hasTie: false,
    };
  }

  // 1. Evaluate all products
  const evaluated: EvaluatedProduct[] = products.map((product) => {
    const suitability = computeSuitability(product, profile);

    const whyMatches = suitability.reasons
      .filter((r) => r.sentiment === "positive" || r.sentiment === "neutral")
      .map((r) => r.label);

    const cautions = suitability.reasons
      .filter((r) => r.sentiment === "caution")
      .map((r) => r.label);

    return { product, suitability, whyMatches, cautions };
  });

  // 2. If no profile, we still evaluate, but scores are all 0/unavailable.
  // We don't rank them by score. We just return the first as the "focus" item,
  // but note that we can't truly determine a strongest match.
  if (!profile) {
    return {
      hasProfile: false,
      strongestMatch: evaluated[0],
      otherProducts: evaluated.slice(1),
      generalCautions: [
        "Complete your financial profile to see personalized suitability scores.",
        ...GENERAL_CAUTIONS,
      ],
      hasTie: false,
    };
  }

  // 3. Profile exists. Sort by score descending.
  evaluated.sort((a, b) => b.suitability.score - a.suitability.score);

  const strongestMatch = evaluated[0];
  const otherProducts = evaluated.slice(1);

  // 4. Check for ties at the top
  const hasTie = otherProducts.some(
    (p) => p.suitability.score === strongestMatch.suitability.score
  );

  const dynamicCautions = [...GENERAL_CAUTIONS];

  if (hasTie && products.length > 1) {
    dynamicCautions.unshift(
      "Multiple products have identical match scores. Review their specific features to break the tie."
    );
  } else if (otherProducts.length > 0) {
    const margin =
      strongestMatch.suitability.score - otherProducts[0].suitability.score;
    if (margin <= 10) {
      dynamicCautions.unshift(
        "The match scores for your top options are very close. Consider secondary factors like provider preference."
      );
    }
  }

  return {
    hasProfile: true,
    strongestMatch,
    otherProducts,
    generalCautions: dynamicCautions,
    hasTie,
  };
}
