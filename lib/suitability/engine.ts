// ─────────────────────────────────────────────────────────────────────────────
// NIRNAY — Deterministic Suitability Engine
//
// PURPOSE:
// Produce a profile-based suitability signal for a product given a user's
// financial profile. This is NOT financial advice. It is a transparent
// heuristic scoring model designed to help users understand why a product
// might or might not fit their stated preferences.
//
// DISCLAIMER:
// Scores are heuristic estimates based only on the data in the user's
// financial profile. They do not account for: actual market conditions, tax
// implications, personal circumstances not captured in the profile, or any
// other factor a qualified financial advisor would consider.
//
// DESIGN:
// Fully deterministic — no LLM, no randomness, no magic numbers without
// documentation. Every weight and threshold is documented below.
// ─────────────────────────────────────────────────────────────────────────────

import type { Product, ProductRiskLevel } from "@/lib/types/product";
import type { FinancialProfileInput } from "@/lib/types/financial-profile";
import { isInsuranceProduct, isInvestmentProduct } from "@/lib/types/product";

// ─────────────────────────────────────────────────────────────────────────────
// Output types
// ─────────────────────────────────────────────────────────────────────────────

export type SuitabilityBand =
  | "strong_match"    // score ≥ 75
  | "good_match"      // score ≥ 55
  | "partial_match"   // score ≥ 35
  | "low_match";      // score < 35

export interface SuitabilityReason {
  /** Short heading for the reason */
  label: string;
  /** Whether this is positive (benefit) or negative (caution) */
  sentiment: "positive" | "caution" | "neutral";
}

export interface SuitabilityResult {
  /**
   * Heuristic score from 0–100.
   * NOT a probability, NOT a guaranteed ranking.
   * Based solely on the user's financial profile inputs.
   */
  score: number;
  band: SuitabilityBand;
  reasons: SuitabilityReason[];
  /** Whether a financial profile was available */
  hasProfile: boolean;
  /** Disclaimer always shown in the UI */
  disclaimer: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Scoring weights — total should equal 100
//
// These weights reflect the relative importance of each dimension to
// suitability. They are transparent and documented here, not hidden in
// any black box.
//
// Risk alignment:       35 — most important: wrong risk is a fundamental mismatch
// Budget compatibility: 30 — can the user actually afford this?
// Goal alignment:       20 — does this product type match their stated goals?
// Experience alignment: 15 — is the product complexity appropriate?
//
// Total:               100
// ─────────────────────────────────────────────────────────────────────────────

const WEIGHTS = {
  risk: 35,
  budget: 30,
  goal: 20,
  experience: 15,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Risk alignment
//
// Conservative profile → only low-risk products fully match
// Moderate profile → moderate and low products match well
// Aggressive profile → all risk levels match (aggressive investors accept lower risk)
// ─────────────────────────────────────────────────────────────────────────────

function scoreRisk(
  userRisk: "conservative" | "moderate" | "aggressive" | null,
  productRisk: ProductRiskLevel,
): { score: number; reason: SuitabilityReason } {
  if (!userRisk) {
    return {
      score: 0.5, // neutral when unknown
      reason: {
        label: "Risk preference not set in your profile",
        sentiment: "neutral",
      },
    };
  }

  const riskMatrix: Record<
    "conservative" | "moderate" | "aggressive",
    Record<ProductRiskLevel, number>
  > = {
    //                       low   moderate  high
    conservative:         { low: 1.0, moderate: 0.4, high: 0.0 },
    moderate:             { low: 0.8, moderate: 1.0, high: 0.6 },
    aggressive:           { low: 0.7, moderate: 0.9, high: 1.0 },
  };

  const score = riskMatrix[userRisk][productRisk];

  let reason: SuitabilityReason;
  if (score >= 0.8) {
    reason = {
      label: `Risk level (${productRisk}) matches your ${userRisk} profile`,
      sentiment: "positive",
    };
  } else if (score >= 0.5) {
    reason = {
      label: `This product's risk (${productRisk}) is slightly outside your ${userRisk} preference`,
      sentiment: "caution",
    };
  } else {
    reason = {
      label: `This product's risk (${productRisk}) does not match your ${userRisk} profile`,
      sentiment: "caution",
    };
  }

  return { score, reason };
}

// ─────────────────────────────────────────────────────────────────────────────
// Budget compatibility
//
// For insurance: compare annual_insurance_budget vs indicative min premium
// For investments: compare monthly_investment_budget vs minimum SIP
//
// Score 1.0 if user budget clearly covers the product
// Score 0.0 if budget is clearly insufficient
// Score 0.5 if budget is unknown
// ─────────────────────────────────────────────────────────────────────────────

function scoreBudget(
  product: Product,
  profile: Partial<FinancialProfileInput>,
): { score: number; reason: SuitabilityReason } {
  if (isInsuranceProduct(product)) {
    const budget = profile.annual_insurance_budget ?? null;
    const minPremium = product.cost.indicativeAnnualMin;

    if (budget === null || minPremium === undefined) {
      return {
        score: 0.5,
        reason: {
          label: "Insurance budget not set — cannot assess affordability",
          sentiment: "neutral",
        },
      };
    }

    if (budget >= minPremium * 1.3) {
      return {
        score: 1.0,
        reason: {
          label: `Your insurance budget (₹${budget.toLocaleString("en-IN")}/yr) comfortably covers this plan`,
          sentiment: "positive",
        },
      };
    } else if (budget >= minPremium) {
      return {
        score: 0.7,
        reason: {
          label: `Your insurance budget (₹${budget.toLocaleString("en-IN")}/yr) covers the indicative minimum premium`,
          sentiment: "positive",
        },
      };
    } else {
      return {
        score: 0.2,
        reason: {
          label: `Indicative minimum premium (₹${minPremium.toLocaleString("en-IN")}) may exceed your stated insurance budget`,
          sentiment: "caution",
        },
      };
    }
  }

  if (isInvestmentProduct(product)) {
    const budget = profile.monthly_investment_budget ?? null;
    const minSip = product.cost.minimumSipAmount;

    if (budget === null || minSip === undefined) {
      return {
        score: 0.5,
        reason: {
          label: "Investment budget not set — cannot assess affordability",
          sentiment: "neutral",
        },
      };
    }

    if (budget >= minSip * 3) {
      return {
        score: 1.0,
        reason: {
          label: `Your monthly investment budget (₹${budget.toLocaleString("en-IN")}) supports a meaningful SIP`,
          sentiment: "positive",
        },
      };
    } else if (budget >= minSip) {
      return {
        score: 0.7,
        reason: {
          label: `Your monthly investment budget covers the minimum SIP (₹${minSip.toLocaleString("en-IN")}/month)`,
          sentiment: "positive",
        },
      };
    } else {
      return {
        score: 0.1,
        reason: {
          label: `Minimum SIP (₹${minSip.toLocaleString("en-IN")}/month) may exceed your stated investment budget`,
          sentiment: "caution",
        },
      };
    }
  }

  return { score: 0.5, reason: { label: "Budget compatibility unknown", sentiment: "neutral" } };
}

// ─────────────────────────────────────────────────────────────────────────────
// Goal alignment
//
// Maps user's primary_goals to relevant product types/subcategories.
// Goals that directly match give full score.
// ─────────────────────────────────────────────────────────────────────────────

const GOAL_PRODUCT_AFFINITY: Record<string, string[]> = {
  // Insurance products by subcategory
  emergency_fund:     ["health", "term_life"],
  protect_family:     ["term_life", "health"],
  buy_home:           ["term_life"],
  // Investment products
  retirement:         ["mutual_fund", "sip"],
  build_wealth:       ["mutual_fund", "sip"],
  education:          ["mutual_fund", "sip"],
  buy_car:            ["mutual_fund"],
  travel:             ["mutual_fund"],
};

function scoreGoals(
  product: Product,
  goals: string[],
): { score: number; reason: SuitabilityReason } {
  if (goals.length === 0) {
    return {
      score: 0.5,
      reason: {
        label: "No goals set — cannot assess goal alignment",
        sentiment: "neutral",
      },
    };
  }

  const productSubcat = product.subcategory;
  const matchingGoals = goals.filter((goal) => {
    const affinity = GOAL_PRODUCT_AFFINITY[goal] ?? [];
    return affinity.includes(productSubcat);
  });

  if (matchingGoals.length > 0) {
    const goalLabels = matchingGoals
      .map((g) => g.replace(/_/g, " "))
      .join(", ");
    return {
      score: 1.0,
      reason: {
        label: `Aligns with your stated goal(s): ${goalLabels}`,
        sentiment: "positive",
      },
    };
  } else {
    return {
      score: 0.3,
      reason: {
        label: "Does not directly map to your stated goals — may still be relevant",
        sentiment: "caution",
      },
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Experience alignment
//
// Liquid funds and basic insurance: suitable for beginners
// Large-cap funds: intermediate
// Mid-cap, flexi-cap, international: advanced
// ─────────────────────────────────────────────────────────────────────────────

const PRODUCT_COMPLEXITY: Record<string, "basic" | "intermediate" | "advanced"> = {
  // Insurance — all basic for experience purposes (complexity is risk, not experience)
  "hdfc-ergo-optima-secure":        "basic",
  "star-health-comprehensive":      "basic",
  "bajaj-allianz-motor-own-damage": "basic",
  "icici-lombard-motor-comprehensive": "basic",
  "hdfc-life-click2protect-super":  "basic",
  "lic-tech-term":                  "basic",
  // Investments
  "axis-liquid-fund":               "basic",
  "mirae-large-cap-fund":           "intermediate",
  "sbi-bluechip-fund":              "intermediate",
  "parag-parikh-flexi-cap":         "advanced",
  "hdfc-mid-cap-opportunities":     "advanced",
};

function scoreExperience(
  product: Product,
  experience: "beginner" | "intermediate" | "advanced" | null,
): { score: number; reason: SuitabilityReason } {
  if (!experience) {
    return {
      score: 0.5,
      reason: { label: "Financial experience not set", sentiment: "neutral" },
    };
  }

  const complexity = PRODUCT_COMPLEXITY[product.id] ?? "intermediate";

  const expLevel = { beginner: 0, intermediate: 1, advanced: 2 } as const;
  const complexityLevel = { basic: 0, intermediate: 1, advanced: 2 } as const;

  const userLevel = expLevel[experience];
  const productLevel = complexityLevel[complexity];

  if (userLevel >= productLevel) {
    return {
      score: 1.0,
      reason: {
        label: `Suitable for your ${experience} experience level`,
        sentiment: "positive",
      },
    };
  } else {
    return {
      score: 0.4,
      reason: {
        label: `This product may be more complex than your stated experience level — consider starting simpler`,
        sentiment: "caution",
      },
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Band thresholds
// ─────────────────────────────────────────────────────────────────────────────

function scoreToBand(score: number): SuitabilityBand {
  if (score >= 75) return "strong_match";
  if (score >= 55) return "good_match";
  if (score >= 35) return "partial_match";
  return "low_match";
}

// ─────────────────────────────────────────────────────────────────────────────
// Main suitability function
// ─────────────────────────────────────────────────────────────────────────────

export function computeSuitability(
  product: Product,
  profile: Partial<FinancialProfileInput> | null,
): SuitabilityResult {
  const DISCLAIMER =
    "Profile match is a heuristic estimate based only on your stated profile. " +
    "It is not financial advice. Verify product details with the provider before making any decision.";

  // If no profile provided — return a neutral result, not an error
  if (!profile) {
    return {
      score: 0,
      band: "low_match",
      hasProfile: false,
      reasons: [
        {
          label: "Set up your financial profile to see a personalised match score",
          sentiment: "neutral",
        },
      ],
      disclaimer: DISCLAIMER,
    };
  }

  const safeProfile: Partial<FinancialProfileInput> = profile;

  const riskResult = scoreRisk(safeProfile.risk_profile ?? null, product.riskLevel);
  const budgetResult = scoreBudget(product, safeProfile);
  const goalResult = scoreGoals(product, safeProfile.primary_goals ?? []);
  const experienceResult = scoreExperience(product, safeProfile.financial_experience ?? null);

  // Weighted sum — each sub-score is [0,1], weights sum to 100
  const rawScore =
    riskResult.score * WEIGHTS.risk +
    budgetResult.score * WEIGHTS.budget +
    goalResult.score * WEIGHTS.goal +
    experienceResult.score * WEIGHTS.experience;

  const score = Math.round(Math.min(100, Math.max(0, rawScore)));
  const band = scoreToBand(score);

  // Only include meaningful reasons (filter out generic neutrals when others are more specific)
  const reasons: SuitabilityReason[] = [
    riskResult.reason,
    budgetResult.reason,
    goalResult.reason,
    experienceResult.reason,
  ];

  // Append standard investment / insurance cautions
  if (isInvestmentProduct(product)) {
    reasons.push({
      label: "Mutual fund returns are not guaranteed — verify details with the provider",
      sentiment: "caution",
    });
  }
  if (isInsuranceProduct(product)) {
    reasons.push({
      label: "Verify exclusions and waiting periods before purchasing",
      sentiment: "caution",
    });
  }

  return {
    score,
    band,
    hasProfile: true,
    reasons,
    disclaimer: DISCLAIMER,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Band display helpers (used by UI components)
// ─────────────────────────────────────────────────────────────────────────────

export const BAND_LABELS: Record<SuitabilityBand, string> = {
  strong_match: "Strong match",
  good_match:   "Good match",
  partial_match: "Partial match",
  low_match:    "Low match",
};

export const BAND_COLORS: Record<SuitabilityBand, string> = {
  strong_match:  "text-emerald-600 dark:text-emerald-400",
  good_match:    "text-blue-600 dark:text-blue-400",
  partial_match: "text-amber-600 dark:text-amber-400",
  low_match:     "text-muted-foreground",
};

export const BAND_BG: Record<SuitabilityBand, string> = {
  strong_match:  "bg-emerald-50 dark:bg-emerald-950/30",
  good_match:    "bg-blue-50 dark:bg-blue-950/30",
  partial_match: "bg-amber-50 dark:bg-amber-950/30",
  low_match:     "bg-muted/40",
};
