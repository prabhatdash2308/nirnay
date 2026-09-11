/**
 * lib/financial-engine/calculations.ts
 *
 * Pure, deterministic financial calculation utilities.
 * Integrated from Sarvesh Dhanrale's backend financial engine (origin/backend).
 *
 * These functions have zero side effects, no API calls, no authentication,
 * and no database dependencies. They are safe to use in any rendering context.
 *
 * Existing portfolio/goals/calendar calculations remain unchanged in their
 * respective modules. This module adds new capabilities: SIP projections,
 * coverage gap analysis, emergency fund assessment, and dashboard aggregation.
 */

const MONTHS_PER_YEAR = 12;

// ─────────────────────────────────────────────────────────────────────────────
// Primitive rounding utilities
// ─────────────────────────────────────────────────────────────────────────────

/** Rounds a monetary amount to `decimals` decimal places (default 2). */
export function roundAmount(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/** Rounds a percentage value to `decimals` decimal places (default 1). */
export function roundPercentage(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/** Clamps a value between min and max (inclusive). */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// ─────────────────────────────────────────────────────────────────────────────
// SIP Projection
// ─────────────────────────────────────────────────────────────────────────────

export type SIPProjectionInputs = {
  /** Monthly SIP instalment amount in ₹. */
  monthlyAmount: number;
  /** Expected annual return rate (e.g. 12 for 12%). */
  annualRatePct: number;
  /** Investment duration in years. */
  years: number;
  /** Optional lump-sum initial investment in ₹ (default 0). */
  initialAmount?: number;
  /** Optional annual SIP step-up rate (e.g. 10 for 10% per year, default 0). */
  increaseRatePct?: number;
};

export type SIPResult = {
  totalInvested: number;
  estimatedValue: number;
  estimatedGains: number;
  /** Effective CAGR of the investment or null if not computable. */
  cagrPct: number | null;
  monthlyBreakdown?: Array<{ month: number; value: number; invested: number }>;
};

/**
 * Projects a Systematic Investment Plan (SIP) corpus.
 *
 * Supports step-up SIPs (annual increase) and an optional lump-sum initial
 * amount. Compound interest is applied monthly.
 *
 * @param inputs - SIP projection parameters
 * @param includeBreakdown - when true, attaches a month-by-month breakdown
 */
export function calculateSIPProjection(
  inputs: SIPProjectionInputs,
  includeBreakdown = false,
): SIPResult {
  const {
    monthlyAmount,
    annualRatePct,
    years,
    initialAmount = 0,
    increaseRatePct = 0,
  } = inputs;

  const months = Math.max(1, Math.floor(years * MONTHS_PER_YEAR));
  const monthlyRate = annualRatePct / 100 / MONTHS_PER_YEAR;

  let value = initialAmount;
  let totalInvested = initialAmount;
  let currentSIPAmount = monthlyAmount;

  const breakdown: Array<{ month: number; value: number; invested: number }> =
    [];

  for (let month = 1; month <= months; month++) {
    value *= 1 + monthlyRate;
    value += currentSIPAmount;
    totalInvested += currentSIPAmount;

    if (increaseRatePct > 0 && month % MONTHS_PER_YEAR === 0) {
      currentSIPAmount = roundAmount(
        currentSIPAmount * (1 + increaseRatePct / 100),
      );
    }

    if (includeBreakdown) {
      breakdown.push({
        month,
        value: roundAmount(value),
        invested: roundAmount(totalInvested),
      });
    }
  }

  value = roundAmount(value);
  totalInvested = roundAmount(totalInvested);
  const gains = roundAmount(value - totalInvested);

  let cagr: number | null = null;
  if (totalInvested > 0 && value > 0 && years > 0) {
    cagr = roundPercentage(
      (Math.pow(value / totalInvested, 1 / years) - 1) * 100,
      2,
    );
  }

  return {
    totalInvested,
    estimatedValue: value,
    estimatedGains: gains,
    cagrPct: cagr,
    monthlyBreakdown: includeBreakdown ? breakdown : undefined,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Coverage Gap Analysis
// ─────────────────────────────────────────────────────────────────────────────

export type CoverageGapInputs = {
  /** User's current sum insured in ₹. */
  currentSumInsured: number;
  /** Recommended minimum coverage in ₹. */
  recommendedMin: number;
  /** Optional annual income in ₹ used together with multiplierRule. */
  annualIncome?: number;
  /** Optional income-multiple rule to dynamically compute a higher threshold. */
  multiplierRule?: { incomeMultiple: number; label: string } | null;
};

export type CoverageGapResult = {
  gapAmount: number;
  /** Percentage of recommended threshold currently covered, or null if unknown. */
  gapPercentage: number | null;
  status: "adequate" | "gap" | "significant_gap" | "missing_data";
  recommendation: string;
};

/**
 * Determines whether a user's current insurance coverage is adequate.
 *
 * When an annualIncome + multiplierRule are provided the threshold is raised
 * to the higher of recommendedMin and (income × multiple), implementing a
 * common Indian insurance underwriting rule of thumb (e.g. 10× annual income).
 */
export function calculateCoverageGap(
  inputs: CoverageGapInputs,
): CoverageGapResult {
  const { currentSumInsured, recommendedMin, annualIncome, multiplierRule } =
    inputs;

  let threshold = recommendedMin;
  if (annualIncome && annualIncome > 0 && multiplierRule) {
    threshold = Math.max(threshold, annualIncome * multiplierRule.incomeMultiple);
  }

  if (
    !currentSumInsured ||
    currentSumInsured <= 0 ||
    !threshold ||
    threshold <= 0
  ) {
    return {
      gapAmount: 0,
      gapPercentage: null,
      status: "missing_data",
      recommendation:
        "Please provide your current coverage and income details to assess coverage adequacy.",
    };
  }

  const gap = roundAmount(Math.max(0, threshold - currentSumInsured));
  const gapPct =
    threshold > 0
      ? roundPercentage((currentSumInsured / threshold) * 100)
      : null;

  if (gap === 0) {
    return {
      gapAmount: 0,
      gapPercentage: gapPct,
      status: "adequate",
      recommendation:
        "Current coverage appears adequate for your stated profile.",
    };
  }

  const ratio = currentSumInsured / threshold;

  if (ratio < 0.5) {
    return {
      gapAmount: gap,
      gapPercentage: gapPct,
      status: "significant_gap",
      recommendation: `Consider increasing coverage by ₹${gap.toLocaleString("en-IN")} to reach the recommended minimum of ₹${threshold.toLocaleString("en-IN")}.`,
    };
  }

  return {
    gapAmount: gap,
    gapPercentage: gapPct,
    status: "gap",
    recommendation: `Coverage is close but consider an additional ₹${gap.toLocaleString("en-IN")} for full recommended protection.`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Emergency Fund Assessment
// ─────────────────────────────────────────────────────────────────────────────

export type EmergencyFundInputs = {
  /** User's monthly expenses in ₹. */
  monthlyExpenses: number;
  /** User's current liquid savings in ₹. */
  currentSavings: number;
  /** Target months of expenses to maintain as a buffer (default: 6). */
  monthsCoverage?: number;
};

export type EmergencyFundResult = {
  targetAmount: number;
  /** Current savings as % of target, or null if target cannot be computed. */
  currentPercentage: number | null;
  shortfall: number;
  surplus: number;
  /** How many months of expenses the current savings covers. */
  monthsCurrentlyCovered: number | null;
  status: "inadequate" | "adequate" | "strong";
};

/**
 * Assesses the user's emergency fund against the standard "N months of
 * expenses" benchmark (default 6 months).
 *
 * Status thresholds:
 *  - strong    ≥ 100% of target
 *  - adequate  ≥  50% of target
 *  - inadequate < 50% of target
 */
export function calculateEmergencyFund(
  inputs: EmergencyFundInputs,
): EmergencyFundResult {
  const { monthlyExpenses, currentSavings, monthsCoverage = 6 } = inputs;

  if (!monthlyExpenses || monthlyExpenses <= 0) {
    return {
      targetAmount: 0,
      currentPercentage: null,
      shortfall: 0,
      surplus: 0,
      monthsCurrentlyCovered: null,
      status: "inadequate",
    };
  }

  const target = roundAmount(monthlyExpenses * monthsCoverage);
  const current = Math.max(currentSavings ?? 0, 0);
  const pct = target > 0 ? roundPercentage((current / target) * 100) : null;
  const shortfall = roundAmount(Math.max(0, target - current));
  const surplus = roundAmount(Math.max(0, current - target));
  const monthsCovered = roundAmount(
    monthlyExpenses > 0 ? current / monthlyExpenses : 0,
    1,
  );

  let status: EmergencyFundResult["status"] = "inadequate";
  if (pct !== null) {
    if (pct >= 100) status = "strong";
    else if (pct >= 50) status = "adequate";
  }

  return {
    targetAmount: target,
    currentPercentage: pct,
    shortfall,
    surplus,
    monthsCurrentlyCovered: monthsCovered,
    status,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Summary Aggregation
// ─────────────────────────────────────────────────────────────────────────────

export type AggregatedProfile = {
  monthlyIncome?: number | null;
  monthlyExpenses?: number | null;
  monthlyInvestmentBudget?: number | null;
  annualInsuranceBudget?: number | null;
  riskProfile?: "conservative" | "moderate" | "aggressive" | null;
  totalActivePolicies: number;
  totalActiveInvestments: number;
  totalAnnualPremium: number;
  totalMonthlyInvestment: number;
  totalGoals: number;
  upcomingRenewalsCount: number;
};

export type DashboardSummary = {
  /** Monthly income minus expenses, or null when either is unknown. */
  monthlySurplus: number | null;
  /** Savings rate as % of income, or null when income is unknown. */
  savingsRatePct: number | null;
  /** Annual premium spend as % of annual insurance budget. */
  insuranceBudgetUtilizationPct: number | null;
  /** Monthly investment spend as % of monthly investment budget. */
  investmentBudgetUtilizationPct: number | null;
  totalActivePolicies: number;
  totalActiveInvestments: number;
  totalGoals: number;
  upcomingRenewalsCount: number;
  totalAnnualPremium: number;
  totalMonthlyInvestment: number;
};

/**
 * Derives key financial health indicators from aggregated portfolio and
 * profile data. All inputs are optional; unavailable data yields null metrics
 * rather than incorrect values.
 */
export function calculateDashboardSummary(
  profile: AggregatedProfile,
): DashboardSummary {
  const income = profile.monthlyIncome ?? null;
  const expenses = profile.monthlyExpenses ?? null;

  const surplus =
    income !== null && expenses !== null
      ? roundAmount(income - expenses)
      : null;

  const savingsRate =
    income !== null && income > 0 && surplus !== null
      ? roundPercentage((surplus / income) * 100)
      : null;

  const insuranceUtil =
    profile.annualInsuranceBudget && profile.annualInsuranceBudget > 0
      ? roundPercentage(
          (profile.totalAnnualPremium / profile.annualInsuranceBudget) * 100,
        )
      : null;

  const investmentUtil =
    profile.monthlyInvestmentBudget && profile.monthlyInvestmentBudget > 0
      ? roundPercentage(
          (profile.totalMonthlyInvestment / profile.monthlyInvestmentBudget) *
            100,
        )
      : null;

  return {
    monthlySurplus: surplus,
    savingsRatePct: savingsRate,
    insuranceBudgetUtilizationPct: insuranceUtil,
    investmentBudgetUtilizationPct: investmentUtil,
    totalActivePolicies: profile.totalActivePolicies,
    totalActiveInvestments: profile.totalActiveInvestments,
    totalGoals: profile.totalGoals,
    upcomingRenewalsCount: profile.upcomingRenewalsCount,
    totalAnnualPremium: roundAmount(profile.totalAnnualPremium),
    totalMonthlyInvestment: roundAmount(profile.totalMonthlyInvestment),
  };
}
