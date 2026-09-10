import { ExtractedIntent } from "../intent/schemas";
import { ProductData, RecommendationResult } from "./schemas";

export function scoreProduct(intent: ExtractedIntent, product: ProductData): RecommendationResult | null {
  // If product category doesn't strictly match the intent category, it's incompatible.
  // Exception: if intent category is "unknown", we might score everything but usually we filter by category first.
  if (intent.category !== "unknown" && product.category !== intent.category) {
    return null; // Hard exclusion
  }

  const breakdown = {
    budgetFit: 0,
    requirementFit: 0,
    goalAlignment: 0,
    riskAlignment: 0,
  };

  const tradeOffs: string[] = [];
  const matchedRequirements: string[] = [];
  const unmetRequirements: string[] = [];
  const missingInformation: string[] = [];
  let hardConstraintFailed = false;

  // 1. Budget Fit (Max 40 points)
  const budget = intent.financialContext?.monthlyBudget;
  if (budget && product.premium) {
    if (product.premium <= budget) {
      breakdown.budgetFit = 40;
      matchedRequirements.push("Fits within monthly budget");
    } else if (product.premium <= budget * 1.2) {
      // Up to 20% over budget
      breakdown.budgetFit = 20;
      tradeOffs.push("Slightly exceeds stated monthly budget");
    } else {
      breakdown.budgetFit = 0;
      tradeOffs.push("Significantly exceeds stated monthly budget");
    }
  } else if (!budget) {
    // We cannot evaluate budget
    missingInformation.push("budget");
    breakdown.budgetFit = 0; // Does not get the points if we can't verify
  }

  // 2. Requirements Fit (Max 40 points)
  const userRequirements = [...(intent.requirements || []), ...(intent.beneficiaries || [])];
  
  if (userRequirements.length > 0) {
    let matchedCount = 0;
    for (const req of userRequirements) {
      const lowerReq = req.toLowerCase();
      // Check hard exclusions
      const violatesExclusion = product.exclusions.some(ex => ex.toLowerCase().includes(lowerReq) || lowerReq.includes(ex.toLowerCase()));
      if (violatesExclusion) {
        hardConstraintFailed = true;
        unmetRequirements.push(`Product excludes: ${req}`);
        break;
      }

      // Check features
      const matchesFeature = product.features.some(feat => feat.toLowerCase().includes(lowerReq) || lowerReq.includes(feat.toLowerCase()));
      if (matchesFeature) {
        matchedCount++;
        matchedRequirements.push(`Supports: ${req}`);
      } else {
        unmetRequirements.push(`Does not explicitly support: ${req}`);
      }
    }

    if (hardConstraintFailed) return null; // Immediately exclude

    breakdown.requirementFit = Math.round((matchedCount / userRequirements.length) * 40);
  } else {
    breakdown.requirementFit = 20; // Default baseline if no requirements specified
  }

  // 3. Risk Alignment (Max 20 points)
  const userRisk = intent.financialContext?.riskPreference?.toLowerCase();
  if (userRisk && product.riskLevel) {
    if (userRisk === product.riskLevel.toLowerCase()) {
      breakdown.riskAlignment = 20;
      matchedRequirements.push(`Matches risk preference: ${userRisk}`);
    } else {
      breakdown.riskAlignment = 0;
      tradeOffs.push(`Risk mismatch. Product is ${product.riskLevel}, user prefers ${userRisk}`);
    }
  } else if (userRisk) {
    missingInformation.push("product risk level");
  }

  const totalScore = breakdown.budgetFit + breakdown.requirementFit + breakdown.goalAlignment + breakdown.riskAlignment;

  return {
    productId: product.id,
    score: totalScore,
    rank: 0, // Will be assigned by ranker
    matchedRequirements,
    tradeOffs,
    unmetRequirements,
    missingInformation,
    scoreBreakdown: breakdown,
  };
}
