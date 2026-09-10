import {
  InsuranceProductForCompare,
  MutualFundForCompare,
} from "./comparison";
import {
  calculateBudgetFit,
  clamp,
  roundAmount,
} from "./calculations";

// ============================================================
// Shared scoring types
// ============================================================
export type ScoredInsuranceProduct = {
  product_key: string;
  provider: string;
  product_name: string;
  score: number;
  grade: "strong_fit" | "good_fit" | "consider" | "not_recommended";
  matched_factors: string[];
  tradeoffs: string[];
  missing_inputs: string[];
  breakdown: {
    budget_fit_score: number | null;
    coverage_score: number | null;
    features_score: number | null;
    provider_score: number | null;
    wait_period_penalty: number | null;
  };
  budget_status: "within" | "close" | "over" | "unknown";
  yearly_premium: number | null;
  sum_insured_recommended: number | null;
  source_provenance: {
    source: string | null;
    data_classification: string | null;
  };
};

export type InsuranceRecommendationContext = {
  product_type: "health" | "motor" | "life";
  user_age?: number | null;
  annual_budget?: number | null;
  sum_insured_target?: number | null;
  risk_preference?: "conservative" | "moderate" | "aggressive" | null;
  must_have_features?: string[] | null;
  existing_coverage?: number | null;
  dependents_count?: number | null;
  annual_income?: number | null;
};

export type InsuranceRecommendationResult = {
  request_summary: {
    product_type: string;
    inputs_provided: string[];
    assumptions: string[];
  };
  results: ScoredInsuranceProduct[];
  overall_note: string;
  methodology: string[];
};

const INSURANCE_WEIGHTS = {
  budget_fit: 0.3,
  coverage: 0.25,
  features: 0.25,
  provider_trust: 0.1,
  wait_period: 0.1,
};

const TRUSTED_PROVIDERS_SCORE: Record<string, number> = {
  LIC: 100,
  "SBI General": 95,
  "New India Assurance": 95,
  "HDFC Ergo": 90,
  "HDFC Life": 90,
  "ICICI Lombard": 88,
  "ICICI Prudential": 88,
  "TATA AIG": 86,
  "Niva Bupa": 84,
  "Star Health": 82,
  "Max Life": 85,
  "Axis Mutual Fund": 85,
  "UTI Mutual Fund": 90,
  "Kotak Mutual Fund": 85,
  "PPFAS Mutual Fund": 86,
};

function providerTrustScore(provider: string | null | undefined): number {
  if (!provider) return 60;
  return TRUSTED_PROVIDERS_SCORE[provider] ?? 65;
}

function gradeFromScore(score: number): ScoredInsuranceProduct["grade"] {
  if (score >= 80) return "strong_fit";
  if (score >= 65) return "good_fit";
  if (score >= 45) return "consider";
  return "not_recommended";
}

function inferSIForHealth(
  annualIncome?: number | null,
  target?: number | null,
): number {
  if (target && target > 0) return target;
  if (annualIncome && annualIncome > 0) return annualIncome * 0.5;
  return 500000;
}

function inferSIForLife(
  annualIncome?: number | null,
  target?: number | null,
  dependents?: number | null,
): number {
  if (target && target > 0) return target;
  const baseIncome = annualIncome && annualIncome > 0 ? annualIncome * 10 : 10000000;
  const dependentMult = dependents && dependents > 0 ? 1 + dependents * 0.25 : 1;
  return roundAmount(baseIncome * dependentMult);
}

function inferSIForMotor(target?: number | null): number {
  return target && target > 0 ? target : 1200000;
}

// ============================================================
// Insurance Recommendation / Scoring Engine
// ============================================================
export function scoreInsuranceProducts(
  products: InsuranceProductForCompare[],
  context: InsuranceRecommendationContext,
): InsuranceRecommendationResult {
  const {
    product_type,
    annual_budget,
    sum_insured_target,
    user_age,
    risk_preference,
    must_have_features,
    annual_income,
    dependents_count,
  } = context;

  const assumptions: string[] = [];
  const inputsProvided: string[] = [];

  if (annual_budget && annual_budget > 0) inputsProvided.push("annual_budget");
  else assumptions.push("No annual insurance budget provided — budget-fit score neutralized.");
  if (user_age && user_age > 0) inputsProvided.push("user_age");
  if (annual_income && annual_income > 0) inputsProvided.push("annual_income");
  if (dependents_count && dependents_count > 0) inputsProvided.push("dependents_count");
  if (sum_insured_target && sum_insured_target > 0) inputsProvided.push("sum_insured_target");
  if (risk_preference) inputsProvided.push("risk_preference");
  if (must_have_features && must_have_features.length > 0)
    inputsProvided.push("must_have_features");

  let recommendedSI = 0;
  if (product_type === "health") {
    recommendedSI = inferSIForHealth(annual_income ?? null, sum_insured_target ?? null);
    if (!sum_insured_target)
      assumptions.push(
        `Default sum insured target of ₹${recommendedSI.toLocaleString("en-IN")} inferred for health.`,
      );
  } else if (product_type === "life") {
    recommendedSI = inferSIForLife(
      annual_income ?? null,
      sum_insured_target ?? null,
      dependents_count ?? null,
    );
    if (!sum_insured_target)
      assumptions.push(
        `Default sum insured target of ₹${recommendedSI.toLocaleString("en-IN")} inferred based on 10x income + dependents.`,
      );
  } else {
    recommendedSI = inferSIForMotor(sum_insured_target ?? null);
    if (!sum_insured_target)
      assumptions.push(
        `Default sum insured target of ₹${recommendedSI.toLocaleString("en-IN")} for motor.`,
      );
  }

  const filtered = products.filter((p) => p.product_type === product_type);

  const scored: ScoredInsuranceProduct[] = filtered.map((p) => {
    const matchedFactors: string[] = [];
    const tradeoffs: string[] = [];
    const missingInputs: string[] = [];

    // 1. Budget fit score
    let budgetFitScore: number | null = null;
    let budgetStatus: ScoredInsuranceProduct["budget_status"] = "unknown";

    if (annual_budget && annual_budget > 0 && p.base_premium && p.base_premium > 0) {
      const fit = calculateBudgetFit({
        productCost: p.base_premium,
        userBudget: annual_budget,
        frequency: "yearly",
      });
      budgetStatus = fit.severity;
      if (fit.severity === "within") {
        budgetFitScore = 100;
        matchedFactors.push("Fits within stated annual budget");
      } else if (fit.severity === "close") {
        budgetFitScore = 75;
        tradeoffs.push("Premium is slightly over budget (<10%)");
      } else {
        budgetFitScore = clamp(
          50 - (fit.budgetRatio ?? 0),
          0,
          50,
        );
        tradeoffs.push(
          `Premium exceeds budget by ₹${fit.overageAmount.toLocaleString("en-IN")}`,
        );
      }
    } else {
      budgetFitScore = 75; // neutral if no budget
    }

    // 2. Coverage score (vs recommended SI)
    let coverageScore: number | null = null;
    if (recommendedSI > 0) {
      const productDefault = p.sum_insured_default ?? 0;
      const productMax = p.sum_insured_max ?? productDefault;
      const coverage =
        productDefault >= recommendedSI
          ? 100
          : productMax >= recommendedSI
            ? 85
            : clamp((productMax / recommendedSI) * 100, 0, 100);
      coverageScore = coverage;
      if (coverage >= 85) matchedFactors.push("Coverage adequate for recommended SI");
      else tradeoffs.push("Coverage is below recommended SI threshold");
    }

    // 3. Features score
    let featuresScore = 50; // baseline
    const features = p.features ?? {};

    if ((features as any).restore_benefit === true) {
      featuresScore += 10;
      matchedFactors.push("Includes sum insured restore benefit");
    }
    if ((features as any).opd_cover === true) {
      featuresScore += 8;
      matchedFactors.push("Includes OPD coverage");
    }
    if ((features as any).maternity_cover === true) {
      featuresScore += 6;
    }
    const ncb = (features as any).no_claim_bonus_pct as number | undefined;
    if (ncb && ncb >= 50) {
      featuresScore += 8;
      matchedFactors.push(`High no-claim bonus (${ncb}%)`);
    }
    const waitMonths = (features as any).pre_existing_coverage_months as
      | number
      | undefined;
    if (waitMonths != null && waitMonths <= 24) {
      featuresScore += 8;
      matchedFactors.push(
        `Shorter pre-existing wait (${waitMonths} months)`,
      );
    } else if (waitMonths != null && waitMonths > 36) {
      featuresScore -= 6;
      tradeoffs.push(`Long pre-existing wait (${waitMonths} months)`);
    }
    if ((features as any).free_health_checkup === true) {
      featuresScore += 3;
    }

    // Must-have features check
    if (must_have_features && must_have_features.length > 0) {
      for (const mf of must_have_features) {
        if ((features as any)[mf] !== true && (features as any)[mf] == null) {
          featuresScore -= 15;
          tradeoffs.push(`Missing must-have feature: ${mf}`);
        }
      }
    }
    featuresScore = clamp(featuresScore, 0, 100);

    // 4. Provider trust score
    const providerScore = providerTrustScore(p.provider);

    // 5. Wait period penalty (negative, expressed as positive contribution by inverting)
    let waitPenaltyScore: number | null = null;
    if (waitMonths != null) {
      waitPenaltyScore = clamp(100 - waitMonths * 2, 0, 100);
    }

    // Total weighted score
    const total =
      (budgetFitScore ?? 75) * INSURANCE_WEIGHTS.budget_fit +
      (coverageScore ?? 75) * INSURANCE_WEIGHTS.coverage +
      featuresScore * INSURANCE_WEIGHTS.features +
      providerScore * INSURANCE_WEIGHTS.provider_trust +
      (waitPenaltyScore ?? 75) * INSURANCE_WEIGHTS.wait_period;

    const finalScore = Math.round(clamp(total, 0, 100));

    // Risk preference adjustment
    if (risk_preference === "conservative") {
      if (waitMonths && waitMonths <= 24 && providerScore >= 80) {
        // already counted
      }
    }

    if (matchedFactors.length === 0) matchedFactors.push("Standard features present");
    if (tradeoffs.length === 0) tradeoffs.push("No major trade-offs identified");
    if (inputsProvided.length === 0) missingInputs.push("No user context provided — results generalized");

    const yearlyPremium = p.base_premium ? roundAmount(p.base_premium) : null;

    return {
      product_key: p.product_key,
      provider: p.provider,
      product_name: p.product_name,
      score: finalScore,
      grade: gradeFromScore(finalScore),
      matched_factors: matchedFactors,
      tradeoffs: tradeoffs,
      missing_inputs: missingInputs,
      breakdown: {
        budget_fit_score: budgetFitScore,
        coverage_score: coverageScore,
        features_score: featuresScore,
        provider_score: providerScore,
        wait_period_penalty: waitPenaltyScore,
      },
      budget_status: budgetStatus,
      yearly_premium: yearlyPremium,
      sum_insured_recommended: recommendedSI,
      source_provenance: {
        source: p.source ?? null,
        data_classification: p.data_classification ?? null,
      },
    };
  });

  scored.sort((a, b) => b.score - a.score);

  const methodology = [
    "Weighted deterministic score combining budget fit (30%), coverage adequacy (25%), features (25%), provider trust (10%), and waiting-period penalty (10%).",
    "Sum insured target inferred from income and dependents when not explicitly provided.",
    "Results are guidance only; final suitability depends on detailed policy terms.",
  ];

  let overallNote =
    `Scored ${scored.length} ${product_type} insurance options. ` +
    "Compare top candidates side-by-side and check detailed terms before deciding.";
  if (scored.length > 0 && scored[0].score >= 80) {
    overallNote = `${scored[0].product_name} from ${scored[0].provider} strongly fits the stated profile with a score of ${scored[0].score}. ` +
      "Consider as primary option and compare against other strong/good fit alternatives.";
  }

  return {
    request_summary: {
      product_type,
      inputs_provided: inputsProvided,
      assumptions,
    },
    results: scored,
    overall_note: overallNote,
    methodology,
  };
}

// ============================================================
// Mutual Fund Recommendation / Scoring Engine
// ============================================================
export type ScoredMutualFund = {
  product_key: string;
  provider: string;
  scheme_name: string;
  score: number;
  grade: "strong_fit" | "good_fit" | "consider" | "not_recommended";
  matched_factors: string[];
  tradeoffs: string[];
  missing_inputs: string[];
  breakdown: {
    performance_score: number | null;
    risk_fit_score: number | null;
    cost_score: number | null;
    liquidity_score: number | null;
    scale_score: number | null;
  };
  sip_min: number | null;
  projected_10y_sip_lac: number | null;
  source_provenance: {
    source: string | null;
    data_classification: string | null;
  };
};

export type MutualFundRecommendationContext = {
  investment_type: "sip" | "lumpsum";
  monthly_investment?: number | null;
  risk_preference?: "conservative" | "moderate" | "aggressive" | null;
  investment_horizon_years?: number | null;
  tax_saving_elss?: boolean | null;
  preferred_categories?: string[] | null;
};

export type MutualFundRecommendationResult = {
  request_summary: {
    investment_type: string;
    inputs_provided: string[];
    assumptions: string[];
  };
  results: ScoredMutualFund[];
  overall_note: string;
  methodology: string[];
  disclaimer: string;
};

const MF_WEIGHTS = {
  performance: 0.35,
  risk_fit: 0.3,
  cost: 0.15,
  liquidity: 0.1,
  scale: 0.1,
};

const RISK_TO_CATEGORY_MIN: Record<string, number> = {
  conservative: 0,
  moderate: 1,
  aggressive: 3,
};

const RISK_TO_CATEGORY_MAX: Record<string, number> = {
  conservative: 2,
  moderate: 3,
  aggressive: 5,
};

const RISK_LEVEL_VALUE: Record<string, number> = {
  low: 0,
  moderately_low: 1,
  moderate: 2,
  moderately_high: 3,
  high: 4,
  very_high: 5,
};

export function scoreMutualFunds(
  funds: MutualFundForCompare[],
  context: MutualFundRecommendationContext,
): MutualFundRecommendationResult {
  const {
    investment_type,
    monthly_investment,
    risk_preference,
    investment_horizon_years,
    tax_saving_elss,
    preferred_categories,
  } = context;

  const inputsProvided: string[] = [];
  const assumptions: string[] = [];

  if (monthly_investment && monthly_investment > 0)
    inputsProvided.push("monthly_investment");
  if (risk_preference) inputsProvided.push("risk_preference");
  if (investment_horizon_years && investment_horizon_years > 0)
    inputsProvided.push("investment_horizon_years");
  if (tax_saving_elss) inputsProvided.push("tax_saving_elss");
  if (preferred_categories && preferred_categories.length > 0)
    inputsProvided.push("preferred_categories");

  if (!risk_preference) {
    assumptions.push(
      "No risk preference stated — defaulting to moderate-risk fit scoring.",
    );
  }
  if (!investment_horizon_years || investment_horizon_years <= 0) {
    assumptions.push(
      "No horizon stated — assuming 5-year horizon for performance weight interpretation.",
    );
  }

  const horizon =
    investment_horizon_years && investment_horizon_years > 0
      ? investment_horizon_years
      : 5;
  const effectiveRiskPref = risk_preference ?? "moderate";
  const minRisk = RISK_TO_CATEGORY_MIN[effectiveRiskPref];
  const maxRisk = RISK_TO_CATEGORY_MAX[effectiveRiskPref];

  const scored: ScoredMutualFund[] = funds
    .filter((f) => {
      if (tax_saving_elss) {
        return f.fund_category === "elss";
      }
      if (preferred_categories && preferred_categories.length > 0) {
        return preferred_categories.includes(f.fund_category);
      }
      return true;
    })
    .map((f) => {
      const matchedFactors: string[] = [];
      const tradeoffs: string[] = [];
      const missingInputs: string[] = [];

      // 1. Performance score (composite of 1y, 3y, 5y with horizon weighting)
      let performanceScore: number | null = null;
      const r1 = f.returns_1y ?? null;
      const r3 = f.returns_3y ?? null;
      const r5 = f.returns_5y ?? null;
      if (r1 != null || r3 != null || r5 != null) {
        let w1 = 0.3,
          w3 = 0.4,
          w5 = 0.3;
        if (horizon >= 7) {
          w1 = 0.15;
          w3 = 0.3;
          w5 = 0.55;
        } else if (horizon <= 2) {
          w1 = 0.5;
          w3 = 0.35;
          w5 = 0.15;
        }
        let weighted = 0;
        let totalW = 0;
        if (r1 != null) {
          weighted += clamp(r1, -30, 50) * w1;
          totalW += w1;
        }
        if (r3 != null) {
          weighted += clamp(r3, -30, 50) * w3;
          totalW += w3;
        }
        if (r5 != null) {
          weighted += clamp(r5, -30, 50) * w5;
          totalW += w5;
        }
        const avg = totalW > 0 ? weighted / totalW : 0;
        // map 0-25 range into 0-100 score
        performanceScore = clamp((avg / 25) * 100, 0, 100);
        if (r5 != null && r5 >= 15) {
          matchedFactors.push(`Strong long-term 5Y returns (~${r5.toFixed(1)}%)`);
        }
        if (r3 != null && r3 >= 20) {
          matchedFactors.push(`Solid 3Y track record (~${r3.toFixed(1)}%)`);
        }
      } else {
        performanceScore = 50;
      }

      // 2. Risk fit score
      const riskLevelValue = RISK_LEVEL_VALUE[f.risk_level] ?? 2;
      let riskFitScore: number;
      if (riskLevelValue >= minRisk && riskLevelValue <= maxRisk) {
        riskFitScore = 100;
        matchedFactors.push(
          `Risk level (${f.risk_level.replace("_", " ")}) matches ${effectiveRiskPref} preference`,
        );
      } else if (riskLevelValue < minRisk) {
        riskFitScore = 60 - (minRisk - riskLevelValue) * 10;
        tradeoffs.push("Fund is more conservative than stated preference");
      } else {
        riskFitScore = clamp(60 - (riskLevelValue - maxRisk) * 10, 0, 60);
        tradeoffs.push("Fund carries higher risk than stated preference");
      }
      riskFitScore = clamp(riskFitScore, 0, 100);

      // Horizon/risk alignment
      if (horizon < 3 && riskLevelValue >= 3) {
        riskFitScore = Math.max(0, riskFitScore - 15);
        tradeoffs.push("Equity-oriented fund with short <3Y horizon may be volatile");
      }
      if (horizon >= 5 && riskLevelValue >= 3) {
        riskFitScore = Math.min(100, riskFitScore + 5);
      }

      // 3. Cost score (expense ratio)
      let costScore: number | null = null;
      if (f.expense_ratio != null) {
        const er = f.expense_ratio;
        if (er <= 0.2) {
          costScore = 100;
          matchedFactors.push(`Very low expense ratio (${er.toFixed(2)}%)`);
        } else if (er <= 0.7) {
          costScore = 85;
          matchedFactors.push(`Competitive expense ratio (${er.toFixed(2)}%)`);
        } else if (er <= 1.2) {
          costScore = 65;
        } else {
          costScore = clamp(50 - (er - 1.2) * 20, 0, 50);
          tradeoffs.push(`High expense ratio (${er.toFixed(2)}%)`);
        }
      }

      // 4. Liquidity (lock-in + exit load)
      let liquidityScore = 100;
      const lockIn = f.lock_in_period_months ?? 0;
      if (lockIn > 0) {
        if (tax_saving_elss && lockIn === 36) {
          matchedFactors.push(
            "Standard 3-year lock-in for ELSS tax-saving (80C eligible)",
          );
          liquidityScore = 70;
        } else if (lockIn >= 36) {
          liquidityScore = 50;
          tradeoffs.push(`Long lock-in period (${lockIn} months)`);
        } else {
          liquidityScore = 75;
          tradeoffs.push(`Has lock-in of ${lockIn} months`);
        }
      }
      const exitLoadRaw = f.exit_load ?? "";
      if (exitLoadRaw.includes("1%") && lockIn === 0) {
        liquidityScore -= 5;
      }

      // 5. Scale score (AUM)
      let scaleScore: number | null = null;
      if (f.aum_cr != null && f.aum_cr > 0) {
        if (f.aum_cr >= 20000) {
          scaleScore = 95;
        } else if (f.aum_cr >= 5000) {
          scaleScore = 85;
        } else if (f.aum_cr >= 1000) {
          scaleScore = 70;
        } else {
          scaleScore = 55;
          tradeoffs.push(`Small AUM (₹${f.aum_cr.toFixed(0)} Cr)`);
        }
      }

      // Total weighted
      const total =
        (performanceScore ?? 50) * MF_WEIGHTS.performance +
        riskFitScore * MF_WEIGHTS.risk_fit +
        (costScore ?? 75) * MF_WEIGHTS.cost +
        liquidityScore * MF_WEIGHTS.liquidity +
        (scaleScore ?? 75) * MF_WEIGHTS.scale;

      const finalScore = Math.round(clamp(total, 0, 100));
      if (matchedFactors.length === 0)
        matchedFactors.push("No standout factors against profile");
      if (tradeoffs.length === 0) tradeoffs.push("No significant trade-offs");
      if (inputsProvided.length === 0)
        missingInputs.push("No user context — general ranking only");

      // Rough 10Y projection (simplified compounded, not a guarantee)
      let projected: number | null = null;
      if (
        monthly_investment &&
        monthly_investment > 0 &&
        f.returns_5y != null
      ) {
        const r_annual = Math.max(0.05, f.returns_5y / 100);
        const r_monthly = r_annual / 12;
        const n = 10 * 12;
        const fv =
          monthly_investment *
          ((Math.pow(1 + r_monthly, n) - 1) / r_monthly) *
          (1 + r_monthly);
        projected = roundAmount(fv / 100000, 2);
      }

      return {
        product_key: f.product_key,
        provider: f.provider,
        scheme_name: f.scheme_name,
        score: finalScore,
        grade: gradeFromScore(finalScore),
        matched_factors: matchedFactors,
        tradeoffs: tradeoffs,
        missing_inputs: missingInputs,
        breakdown: {
          performance_score: performanceScore,
          risk_fit_score: riskFitScore,
          cost_score: costScore,
          liquidity_score: liquidityScore,
          scale_score: scaleScore,
        },
        sip_min: f.sip_min_amount ?? null,
        projected_10y_sip_lac: projected,
        source_provenance: {
          source: f.source ?? null,
          data_classification: f.data_classification ?? null,
        },
      };
    });

  scored.sort((a, b) => b.score - a.score);

  const methodology = [
    "Deterministic weighted score: past performance (35%), risk fit (30%), cost/expense ratio (15%), liquidity (10%), scale/AUM (10%).",
    "Performance weights shift by investment horizon (longer horizons give more weight to 5Y returns).",
    "Risk profile is aligned against stated preference using a 6-level risk spectrum.",
  ];

  const disclaimer =
    "Past performance is not indicative of future returns. Mutual fund investments are subject to market risks; read all scheme-related documents carefully.";

  let overallNote =
    `Scored ${scored.length} mutual fund options. ` +
    "Scores help shortlist candidates; verify scheme documents and suitability with a qualified advisor before investing.";
  if (scored.length > 0 && scored[0].score >= 80) {
    overallNote =
      `${scored[0].scheme_name} by ${scored[0].provider} leads the shortlist with a score of ${scored[0].score}. ` +
      "Review the matched factors, trade-offs, and scheme documents before making a final decision.";
  }

  return {
    request_summary: {
      investment_type,
      inputs_provided: inputsProvided,
      assumptions,
    },
    results: scored,
    overall_note: overallNote,
    methodology,
    disclaimer,
  };
}
