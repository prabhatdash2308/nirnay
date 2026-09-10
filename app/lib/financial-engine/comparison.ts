import { clamp, roundAmount, roundPercentage } from "./calculations";

export type InsuranceProductForCompare = {
  id: number | string;
  product_key: string;
  product_type: "health" | "motor" | "life";
  provider: string;
  product_name: string;
  tagline?: string | null;
  base_premium?: number | null;
  premium_frequency?: string;
  sum_insured_min?: number | null;
  sum_insured_max?: number | null;
  sum_insured_default?: number | null;
  features?: Record<string, unknown> | null;
  coverage_details?: Record<string, unknown> | null;
  exclusions?: string[] | null;
  eligibility_criteria?: string[] | null;
  source?: string | null;
  data_classification?: string | null;
};

export type MutualFundForCompare = {
  id: number | string;
  product_key: string;
  provider: string;
  scheme_name: string;
  fund_category: string;
  sub_category?: string | null;
  risk_level: string;
  nav?: number | null;
  expense_ratio?: number | null;
  returns_1y?: number | null;
  returns_3y?: number | null;
  returns_5y?: number | null;
  sip_min_amount?: number | null;
  lumpsum_min_amount?: number | null;
  aum_cr?: number | null;
  lock_in_period_months?: number | null;
  exit_load?: string | null;
  features?: Record<string, unknown> | null;
  source?: string | null;
  data_classification?: string | null;
};

// ============================================================
// Insurance Comparison Engine
// ============================================================
export type InsuranceComparisonContext = {
  user_age?: number | null;
  annual_budget?: number | null;
  sum_insured_target?: number | null;
  risk_preference?: "conservative" | "moderate" | "aggressive" | null;
  must_have_features?: string[] | null;
};

export type InsuranceFieldDifference = {
  field: string;
  label: string;
  values: Record<string, unknown>;
  betterProductKey?: string | null;
  important: boolean;
  category: "premium" | "coverage" | "features" | "provider" | "metadata";
};

export type InsuranceComparisonResult = {
  compared_product_keys: string[];
  target_sum_insured: number | null;
  premiums: {
    product_key: string;
    base_premium: number | null;
    monthly_premium: number | null;
    yearly_premium: number | null;
    budget_status: "within" | "close" | "over" | "unknown";
  }[];
  similarities: string[];
  differences: InsuranceFieldDifference[];
  highlights: string[];
  summary: string;
};

function featureValue(
  product: InsuranceProductForCompare,
  key: string,
): unknown {
  if (!product.features) return null;
  return product.features[key];
}

function booleanMatch(
  a: unknown,
  b: unknown,
): boolean {
  const normalize = (v: unknown) =>
    typeof v === "boolean"
      ? v
      : typeof v === "number"
        ? v !== 0
        : typeof v === "string"
          ? ["true", "yes", "y", "1"].includes(v.toLowerCase())
          : null;
  const na = normalize(a);
  const nb = normalize(b);
  return na !== null && nb !== null && na === nb;
}

function numericCompare(
  a: number | null | undefined,
  b: number | null | undefined,
  direction: "lower_is_better" | "higher_is_better",
): number | null {
  if (a == null || b == null) return null;
  if (a === b) return 0;
  const better = direction === "lower_is_better" ? a < b : a > b;
  return better ? -1 : 1;
}

export function compareInsuranceProducts(
  products: InsuranceProductForCompare[],
  context: InsuranceComparisonContext = {},
): InsuranceComparisonResult {
  if (products.length < 2) {
    return {
      compared_product_keys: products.map((p) => p.product_key),
      target_sum_insured: context.sum_insured_target ?? null,
      premiums: [],
      similarities: [],
      differences: [],
      highlights: [],
      summary: "At least 2 products are required for a meaningful comparison.",
    };
  }

  const keys = products.map((p) => p.product_key);

  const premiums = products.map((p) => {
    const yearly = p.base_premium ?? null;
    const monthly = yearly != null ? roundAmount(yearly / 12) : null;
    let budget_status: InsuranceComparisonResult["premiums"][0]["budget_status"] =
      "unknown";
    if (context.annual_budget && yearly != null) {
      const ratio = yearly / context.annual_budget;
      if (ratio <= 1.0) budget_status = "within";
      else if (ratio <= 1.1) budget_status = "close";
      else budget_status = "over";
    }
    return {
      product_key: p.product_key,
      base_premium: yearly,
      monthly_premium: monthly,
      yearly_premium: yearly,
      budget_status,
    };
  });

  const similarities: string[] = [];
  const differences: InsuranceFieldDifference[] = [];

  // Feature sets to compare
  const commonFeatureChecks = [
    { key: "restore_benefit", label: "Restore Benefit", defaultTrue: false },
    { key: "no_claim_bonus_pct", label: "No Claim Bonus (%)", numeric: true },
    { key: "maternity_cover", label: "Maternity Cover", defaultTrue: false },
    { key: "opd_cover", label: "OPD Cover", defaultTrue: false },
    {
      key: "pre_existing_coverage_months",
      label: "Pre-existing Wait (months)",
      numeric: true,
      lower_better: true,
    },
    { key: "free_health_checkup", label: "Free Health Checkup", defaultTrue: false },
  ];

  for (const feature of commonFeatureChecks) {
    const values: Record<string, unknown> = {};
    products.forEach((p) => {
      values[p.product_key] = featureValue(p, feature.key) ?? null;
    });
    const allNull = Object.values(values).every((v) => v === null);
    if (allNull) continue;

    const distinctCount = new Set(
      Object.values(values).map((v) => JSON.stringify(v)),
    ).size;

    if (distinctCount === 1) {
      similarities.push(`${feature.label}: consistent across compared options`);
      continue;
    }

    let betterKey: string | null = null;
    if (feature.numeric) {
      let best = products[0];
      let bestVal = featureValue(best, feature.key) as number | null;
      for (let i = 1; i < products.length; i++) {
        const curVal = featureValue(products[i], feature.key) as number | null;
        if (bestVal == null && curVal != null) {
          best = products[i];
          bestVal = curVal;
          continue;
        }
        if (bestVal != null && curVal != null) {
          const cmp = numericCompare(
            curVal,
            bestVal,
            feature.lower_better ? "lower_is_better" : "higher_is_better",
          );
          if (cmp === -1) {
            best = products[i];
            bestVal = curVal;
          }
        }
      }
      betterKey = best?.product_key ?? null;
    } else {
      const best = products.find((p) => {
        const val = featureValue(p, feature.key);
        return (
          (typeof val === "boolean" && val === true) ||
          (typeof val === "number" && val > 0)
        );
      });
      if (best) betterKey = best.product_key;
    }

    differences.push({
      field: `features.${feature.key}`,
      label: feature.label,
      values,
      betterProductKey: betterKey,
      important: true,
      category: "features",
    });
  }

  // Premium comparison
  const premiumValues: Record<string, unknown> = {};
  premiums.forEach((p) => {
    premiumValues[p.product_key] = p.yearly_premium;
  });
  const anyPremium = premiums.some((p) => p.yearly_premium != null);
  if (anyPremium) {
    const lowest = premiums
      .filter((p) => p.yearly_premium != null)
      .sort((a, b) => (a.yearly_premium ?? 0) - (b.yearly_premium ?? 0))[0];
    differences.push({
      field: "base_premium",
      label: "Base Annual Premium (₹)",
      values: premiumValues,
      betterProductKey: lowest?.product_key ?? null,
      important: true,
      category: "premium",
    });
  }

  // Coverage comparison
  const coverageValues: Record<string, unknown> = {};
  products.forEach((p) => {
    coverageValues[p.product_key] = p.sum_insured_default ?? null;
  });
  const anyCoverage = products.some((p) => p.sum_insured_default != null);
  if (anyCoverage) {
    const highest = [...products]
      .filter((p) => p.sum_insured_default != null)
      .sort(
        (a, b) =>
          (b.sum_insured_default ?? 0) - (a.sum_insured_default ?? 0),
      )[0];
    differences.push({
      field: "sum_insured_default",
      label: "Default Sum Insured (₹)",
      values: coverageValues,
      betterProductKey: highest?.product_key ?? null,
      important: true,
      category: "coverage",
    });
  }

  // Highlights
  const highlights: string[] = [];
  const withinBudget = premiums.filter((p) => p.budget_status === "within");
  if (withinBudget.length > 0) {
    highlights.push(
      `${withinBudget.length} of ${premiums.length} options fall within the stated annual budget.`,
    );
  }
  const overBudget = premiums.filter((p) => p.budget_status === "over");
  if (overBudget.length > 0) {
    highlights.push(
      `${overBudget.length} option(s) exceed stated budget by more than 10%.`,
    );
  }

  // Must-have feature check
  if (context.must_have_features && context.must_have_features.length > 0) {
    for (const mf of context.must_have_features) {
      const haveIt = products.filter(
        (p) => !!featureValue(p, mf),
      ).length;
      if (haveIt < products.length) {
        highlights.push(
          `Feature "${mf}" is present in ${haveIt} of ${products.length} compared options.`,
        );
      }
    }
  }

  const summary =
    `Side-by-side comparison of ${products.length} ${products[0].product_type} insurance products. ` +
    `${differences.length} key differences detected. ` +
    (highlights.length > 0 ? highlights[0] : "");

  return {
    compared_product_keys: keys,
    target_sum_insured: context.sum_insured_target ?? null,
    premiums,
    similarities,
    differences,
    highlights,
    summary,
  };
}

type InsuranceComparisonResultResult = ReturnType<typeof compareInsuranceProducts>;
export type InsuranceCompareResult = InsuranceComparisonResultResult;

// ============================================================
// Mutual Fund Comparison Engine
// ============================================================
export type MutualFundComparisonContext = {
  monthly_investment?: number | null;
  investment_horizon_years?: number | null;
  risk_preference?: "conservative" | "moderate" | "aggressive" | null;
};

export type MutualFundFieldDifference = {
  field: string;
  label: string;
  values: Record<string, unknown>;
  betterProductKey?: string | null;
  important: boolean;
  category:
    | "returns"
    | "risk"
    | "cost"
    | "liquidity"
    | "metadata";
};

export type MutualFundComparisonResult = {
  compared_product_keys: string[];
  risk_assessments: {
    product_key: string;
    risk_level: string;
    matches_preference: boolean | null;
  }[];
  similarities: string[];
  differences: MutualFundFieldDifference[];
  highlights: string[];
  summary: string;
};

const RISK_ORDER = [
  "low",
  "moderately_low",
  "moderate",
  "moderately_high",
  "high",
  "very_high",
];

function riskMatches(
  level: string,
  pref?: MutualFundComparisonContext["risk_preference"] | null,
): boolean | null {
  if (!pref) return null;
  const prefIdx = {
    conservative: 1,
    moderate: 2,
    aggressive: 4,
  }[pref];
  const levelIdx = RISK_ORDER.indexOf(level);
  if (levelIdx < 0) return null;
  if (pref === "conservative") return levelIdx <= 1;
  if (pref === "moderate") return levelIdx <= 3 && levelIdx >= 1;
  return levelIdx >= 2;
}

export function compareMutualFunds(
  funds: MutualFundForCompare[],
  context: MutualFundComparisonContext = {},
): MutualFundComparisonResult {
  if (funds.length < 2) {
    return {
      compared_product_keys: funds.map((f) => f.product_key),
      risk_assessments: [],
      similarities: [],
      differences: [],
      highlights: [],
      summary: "At least 2 funds are required for a meaningful comparison.",
    };
  }

  const keys = funds.map((f) => f.product_key);
  const riskAssessments = funds.map((f) => ({
    product_key: f.product_key,
    risk_level: f.risk_level,
    matches_preference: riskMatches(f.risk_level, context.risk_preference),
  }));

  const similarities: string[] = [];
  const differences: MutualFundFieldDifference[] = [];

  const numericComparisons: {
    key: keyof MutualFundForCompare;
    label: string;
    direction: "lower_is_better" | "higher_is_better";
    category: MutualFundFieldDifference["category"];
    important: boolean;
  }[] = [
    {
      key: "returns_1y",
      label: "1-Year Return (%)",
      direction: "higher_is_better",
      category: "returns",
      important: true,
    },
    {
      key: "returns_3y",
      label: "3-Year Return (%)",
      direction: "higher_is_better",
      category: "returns",
      important: true,
    },
    {
      key: "returns_5y",
      label: "5-Year Return (%)",
      direction: "higher_is_better",
      category: "returns",
      important: true,
    },
    {
      key: "expense_ratio",
      label: "Expense Ratio (%)",
      direction: "lower_is_better",
      category: "cost",
      important: true,
    },
    {
      key: "sip_min_amount",
      label: "Min SIP Amount (₹)",
      direction: "lower_is_better",
      category: "liquidity",
      important: false,
    },
    {
      key: "aum_cr",
      label: "AUM (₹ Crore)",
      direction: "higher_is_better",
      category: "metadata",
      important: false,
    },
  ];

  for (const nc of numericComparisons) {
    const values: Record<string, unknown> = {};
    funds.forEach((f) => {
      values[f.product_key] = f[nc.key] ?? null;
    });
    const allNull = Object.values(values).every((v) => v === null);
    if (allNull) continue;
    const distinct = new Set(
      Object.values(values).map((v) => JSON.stringify(v)),
    ).size;
    if (distinct === 1) {
      similarities.push(`${nc.label}: consistent across options`);
      continue;
    }

    let bestKey: string | null = null;
    const valid = funds.filter((f) => f[nc.key] != null);
    if (valid.length > 0) {
      const sorted = [...valid].sort((a, b) => {
        const av = a[nc.key] as number;
        const bv = b[nc.key] as number;
        return nc.direction === "higher_is_better" ? bv - av : av - bv;
      });
      bestKey = sorted[0]?.product_key ?? null;
    }

    differences.push({
      field: nc.key as string,
      label: nc.label,
      values,
      betterProductKey: bestKey,
      important: nc.important,
      category: nc.category,
    });
  }

  // Risk comparison
  const riskValues: Record<string, unknown> = {};
  funds.forEach((f) => {
    riskValues[f.product_key] = f.risk_level;
  });
  differences.push({
    field: "risk_level",
    label: "Risk Level",
    values: riskValues,
    betterProductKey: riskAssessments.find((r) => r.matches_preference === true)
      ?.product_key ?? null,
    important: true,
    category: "risk",
  });

  // Lock-in
  const lockInValues: Record<string, unknown> = {};
  funds.forEach((f) => {
    lockInValues[f.product_key] = f.lock_in_period_months ?? null;
  });
  const anyLockIn = funds.some((f) => f.lock_in_period_months != null);
  if (anyLockIn) {
    const best = [...funds]
      .filter((f) => f.lock_in_period_months != null)
      .sort(
        (a, b) =>
          (a.lock_in_period_months ?? 0) - (b.lock_in_period_months ?? 0),
      )[0];
    differences.push({
      field: "lock_in_period_months",
      label: "Lock-in Period (months)",
      values: lockInValues,
      betterProductKey: best?.product_key ?? null,
      important: true,
      category: "liquidity",
    });
  }

  const highlights: string[] = [];
  const riskOk = riskAssessments.filter(
    (r) => r.matches_preference === true,
  ).length;
  if (context.risk_preference) {
    highlights.push(
      `${riskOk} of ${funds.length} funds match stated ${context.risk_preference} risk preference.`,
    );
  }

  const summary =
    `Side-by-side comparison of ${funds.length} mutual funds. ` +
    `${differences.length} important differences detected. ` +
    (highlights.length > 0 ? highlights[0] : "");

  return {
    compared_product_keys: keys,
    risk_assessments: riskAssessments,
    similarities,
    differences,
    highlights,
    summary,
  };
}
