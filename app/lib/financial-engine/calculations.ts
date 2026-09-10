const MONTHS_PER_YEAR = 12;

export function roundAmount(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function roundPercentage(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export type GoalProgressInputs = {
  currentAmount: number;
  targetAmount: number;
  targetDate?: Date | string | null;
  startDate?: Date | string | null;
};

export type GoalProgressResult = {
  progressPercentage: number | null;
  remainingAmount: number;
  monthsToTarget: number | null;
  monthlyContributionRequired: number | null;
  onTrack: boolean | null;
  status: "on_track" | "behind" | "ahead" | "missing_data" | "completed";
};

export function calculateGoalProgress(
  inputs: GoalProgressInputs,
): GoalProgressResult {
  const { currentAmount, targetAmount } = inputs;

  if (!targetAmount || targetAmount <= 0) {
    return {
      progressPercentage: null,
      remainingAmount: 0,
      monthsToTarget: null,
      monthlyContributionRequired: null,
      onTrack: null,
      status: "missing_data",
    };
  }

  const safeCurrent = Math.max(currentAmount ?? 0, 0);
  const remaining = Math.max(targetAmount - safeCurrent, 0);

  const progressPct =
    targetAmount > 0
      ? roundPercentage((safeCurrent / targetAmount) * 100)
      : null;

  if (safeCurrent >= targetAmount) {
    return {
      progressPercentage: 100,
      remainingAmount: 0,
      monthsToTarget: null,
      monthlyContributionRequired: 0,
      onTrack: true,
      status: "completed",
    };
  }

  const targetDateObj = inputs.targetDate ? new Date(inputs.targetDate) : null;
  const startDateObj = inputs.startDate ? new Date(inputs.startDate) : new Date();

  if (!targetDateObj || isNaN(targetDateObj.getTime())) {
    return {
      progressPercentage: progressPct,
      remainingAmount: roundAmount(remaining),
      monthsToTarget: null,
      monthlyContributionRequired: null,
      onTrack: null,
      status: "missing_data",
    };
  }

  const now = new Date();
  const msPerMonth = 1000 * 60 * 60 * 24 * 30.436875;
  const monthsToTarget = Math.max(
    0,
    Math.ceil((targetDateObj.getTime() - now.getTime()) / msPerMonth),
  );

  let monthlyRequired: number | null = null;
  let onTrack: boolean | null = null;

  if (monthsToTarget > 0) {
    monthlyRequired = roundAmount(remaining / monthsToTarget);

    const elapsedMonths = Math.max(
      1,
      Math.round((now.getTime() - startDateObj.getTime()) / msPerMonth),
    );
    const currentMonthlyRate = elapsedMonths > 0 ? safeCurrent / elapsedMonths : 0;
    onTrack = currentMonthlyRate > 0 && currentMonthlyRate >= monthlyRequired;
  } else {
    monthlyRequired = remaining > 0 ? roundAmount(remaining) : 0;
    onTrack = remaining <= 0;
  }

  let status: GoalProgressResult["status"] = "missing_data";
  if (onTrack === false) {
    status = "behind";
  } else if (onTrack === true) {
    status = progressPct !== null && progressPct >= 95 ? "completed" : "on_track";
  }

  return {
    progressPercentage: progressPct,
    remainingAmount: roundAmount(remaining),
    monthsToTarget: monthsToTarget,
    monthlyContributionRequired: monthlyRequired,
    onTrack,
    status,
  };
}

export type BudgetFitInputs = {
  productCost: number;
  userBudget: number;
  frequency?: "monthly" | "quarterly" | "half_yearly" | "yearly" | "one_time";
  targetFrequency?: "monthly" | "yearly";
};

export type BudgetFitResult = {
  normalizedCost: number;
  monthlyCost: number;
  yearlyCost: number;
  budgetRatio: number | null;
  fitsBudget: boolean;
  severity: "within" | "close" | "over";
  overageAmount: number;
};

function annualizeCost(
  cost: number,
  frequency: BudgetFitInputs["frequency"] = "yearly",
): number {
  switch (frequency) {
    case "monthly":
      return cost * MONTHS_PER_YEAR;
    case "quarterly":
      return cost * 4;
    case "half_yearly":
      return cost * 2;
    case "yearly":
    case "one_time":
    default:
      return cost;
  }
}

export function calculateBudgetFit(
  inputs: BudgetFitInputs,
): BudgetFitResult {
  const { productCost, userBudget, frequency, targetFrequency = "yearly" } =
    inputs;

  const annualized = annualizeCost(productCost, frequency);
  const monthlyCost = roundAmount(annualized / MONTHS_PER_YEAR);
  const yearlyCost = roundAmount(annualized);

  const normalizedCost =
    targetFrequency === "monthly" ? monthlyCost : yearlyCost;

  if (!userBudget || userBudget <= 0) {
    return {
      normalizedCost,
      monthlyCost,
      yearlyCost,
      budgetRatio: null,
      fitsBudget: true,
      severity: "within",
      overageAmount: 0,
    };
  }

  const ratio = annualized / userBudget;
  const overage = roundAmount(Math.max(0, annualized - userBudget));

  let severity: BudgetFitResult["severity"] = "within";
  if (ratio > 1.1) {
    severity = "over";
  } else if (ratio > 1.0) {
    severity = "close";
  }

  return {
    normalizedCost,
    monthlyCost,
    yearlyCost,
    budgetRatio: roundPercentage(ratio * 100),
    fitsBudget: ratio <= 1.0,
    severity,
    overageAmount: overage,
  };
}

export type SIPProjectionInputs = {
  monthlyAmount: number;
  annualRatePct: number;
  years: number;
  initialAmount?: number;
  increaseRatePct?: number;
};

export type SIPResult = {
  totalInvested: number;
  estimatedValue: number;
  estimatedGains: number;
  cagrPct: number | null;
  monthlyBreakdown?: Array<{ month: number; value: number; invested: number }>;
};

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

  const breakdown: Array<{ month: number; value: number; invested: number }> = [];

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

export type CoverageGapInputs = {
  currentSumInsured: number;
  recommendedMin: number;
  annualIncome?: number;
  multiplierRule?: { incomeMultiple: number; label: string } | null;
};

export type CoverageGapResult = {
  gapAmount: number;
  gapPercentage: number | null;
  status: "adequate" | "gap" | "significant_gap" | "missing_data";
  recommendation: string;
};

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

export type EmergencyFundInputs = {
  monthlyExpenses: number;
  currentSavings: number;
  monthsCoverage?: number;
};

export type EmergencyFundResult = {
  targetAmount: number;
  currentPercentage: number | null;
  shortfall: number;
  surplus: number;
  monthsCurrentlyCovered: number | null;
  status: "inadequate" | "adequate" | "strong";
};

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
  monthlySurplus: number | null;
  savingsRatePct: number | null;
  insuranceBudgetUtilizationPct: number | null;
  investmentBudgetUtilizationPct: number | null;
  totalActivePolicies: number;
  totalActiveInvestments: number;
  totalGoals: number;
  upcomingRenewalsCount: number;
  totalAnnualPremium: number;
  totalMonthlyInvestment: number;
};

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
