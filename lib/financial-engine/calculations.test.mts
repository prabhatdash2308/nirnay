import { describe, it, expect } from "vitest";
import {
  roundAmount,
  roundPercentage,
  clamp,
  calculateSIPProjection,
  calculateCoverageGap,
  calculateEmergencyFund,
  calculateDashboardSummary,
} from "./calculations";

// ─────────────────────────────────────────────────────────────────────────────
// Primitive utilities
// ─────────────────────────────────────────────────────────────────────────────

describe("roundAmount", () => {
  it("rounds to 2 decimal places by default", () => {
    expect(roundAmount(1.005)).toBe(1.01);
    expect(roundAmount(1234.567)).toBe(1234.57);
  });

  it("handles zero", () => {
    expect(roundAmount(0)).toBe(0);
  });

  it("handles negative values", () => {
    expect(roundAmount(-1.005)).toBe(-1);
    expect(roundAmount(-10.555)).toBe(-10.55);
  });

  it("respects custom decimals", () => {
    expect(roundAmount(1234.5678, 0)).toBe(1235);
    expect(roundAmount(1234.5678, 3)).toBe(1234.568);
  });
});

describe("roundPercentage", () => {
  it("rounds to 1 decimal place by default", () => {
    expect(roundPercentage(12.345)).toBe(12.3);
    expect(roundPercentage(12.355)).toBe(12.4);
  });

  it("handles zero", () => {
    expect(roundPercentage(0)).toBe(0);
  });

  it("handles 100%", () => {
    expect(roundPercentage(100)).toBe(100);
  });
});

describe("clamp", () => {
  it("returns value when within range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps to min", () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it("clamps to max", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("handles equal min and max", () => {
    expect(clamp(7, 5, 5)).toBe(5);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SIP Projection
// ─────────────────────────────────────────────────────────────────────────────

describe("calculateSIPProjection", () => {
  it("projects a basic SIP over 1 year at 12% p.a.", () => {
    const result = calculateSIPProjection({
      monthlyAmount: 10000,
      annualRatePct: 12,
      years: 1,
    });
    // 12 months of ₹10,000 = ₹1,20,000 invested; result should exceed investment
    expect(result.totalInvested).toBe(120000);
    expect(result.estimatedValue).toBeGreaterThan(120000);
    expect(result.estimatedGains).toBeGreaterThan(0);
    expect(result.cagrPct).not.toBeNull();
  });

  it("handles zero annual rate (pure savings, no interest)", () => {
    const result = calculateSIPProjection({
      monthlyAmount: 5000,
      annualRatePct: 0,
      years: 2,
    });
    expect(result.totalInvested).toBe(120000);
    expect(result.estimatedValue).toBe(120000);
    expect(result.estimatedGains).toBe(0);
    // CAGR is 0% when no growth
    expect(result.cagrPct).toBe(0);
  });

  it("includes an initial lump-sum amount", () => {
    const withLumpSum = calculateSIPProjection({
      monthlyAmount: 0,
      annualRatePct: 10,
      years: 1,
      initialAmount: 100000,
    });
    expect(withLumpSum.estimatedValue).toBeGreaterThan(100000);
  });

  it("applies annual step-up correctly", () => {
    const base = calculateSIPProjection({
      monthlyAmount: 10000,
      annualRatePct: 12,
      years: 2,
    });
    const stepUp = calculateSIPProjection({
      monthlyAmount: 10000,
      annualRatePct: 12,
      years: 2,
      increaseRatePct: 10, // 10% step-up after year 1
    });
    // Step-up means more invested and more growth
    expect(stepUp.totalInvested).toBeGreaterThan(base.totalInvested);
    expect(stepUp.estimatedValue).toBeGreaterThan(base.estimatedValue);
  });

  it("includes a breakdown when requested", () => {
    const result = calculateSIPProjection(
      { monthlyAmount: 1000, annualRatePct: 12, years: 1 },
      true,
    );
    expect(result.monthlyBreakdown).toBeDefined();
    expect(result.monthlyBreakdown!.length).toBe(12);
    expect(result.monthlyBreakdown![0].month).toBe(1);
  });

  it("does NOT include breakdown by default", () => {
    const result = calculateSIPProjection({
      monthlyAmount: 1000,
      annualRatePct: 12,
      years: 1,
    });
    expect(result.monthlyBreakdown).toBeUndefined();
  });

  it("handles fractional year inputs (uses floor of months)", () => {
    const result = calculateSIPProjection({
      monthlyAmount: 10000,
      annualRatePct: 12,
      years: 1.5,
    });
    // 1.5 * 12 = 18 months
    expect(result.totalInvested).toBe(180000);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Coverage Gap Analysis
// ─────────────────────────────────────────────────────────────────────────────

describe("calculateCoverageGap", () => {
  it("returns adequate when coverage exceeds threshold", () => {
    const result = calculateCoverageGap({
      currentSumInsured: 1000000,
      recommendedMin: 500000,
    });
    expect(result.status).toBe("adequate");
    expect(result.gapAmount).toBe(0);
  });

  it("returns gap when partially covered", () => {
    const result = calculateCoverageGap({
      currentSumInsured: 400000,
      recommendedMin: 500000,
    });
    expect(result.status).toBe("gap");
    expect(result.gapAmount).toBe(100000);
  });

  it("returns significant_gap when below 50% threshold", () => {
    const result = calculateCoverageGap({
      currentSumInsured: 200000,
      recommendedMin: 500000,
    });
    expect(result.status).toBe("significant_gap");
    expect(result.gapAmount).toBe(300000);
  });

  it("returns missing_data for zero currentSumInsured", () => {
    const result = calculateCoverageGap({
      currentSumInsured: 0,
      recommendedMin: 500000,
    });
    expect(result.status).toBe("missing_data");
    expect(result.gapPercentage).toBeNull();
  });

  it("raises threshold using income multiplier rule", () => {
    // 10× income rule: 1,000,000 income → threshold max(500000, 10000000) = 10,000,000
    const result = calculateCoverageGap({
      currentSumInsured: 3000000,
      recommendedMin: 500000,
      annualIncome: 1000000,
      multiplierRule: { incomeMultiple: 10, label: "10x income" },
    });
    expect(result.status).toBe("significant_gap"); // 3M vs 10M threshold
    expect(result.gapAmount).toBe(7000000);
  });

  it("returns adequate with income multiplier when sufficiently covered", () => {
    const result = calculateCoverageGap({
      currentSumInsured: 10000000,
      recommendedMin: 500000,
      annualIncome: 1000000,
      multiplierRule: { incomeMultiple: 10, label: "10x income" },
    });
    expect(result.status).toBe("adequate");
    expect(result.gapAmount).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Emergency Fund Assessment
// ─────────────────────────────────────────────────────────────────────────────

describe("calculateEmergencyFund", () => {
  it("correctly calculates 6-month target", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 50000,
      currentSavings: 300000,
    });
    expect(result.targetAmount).toBe(300000); // 50000 × 6
    expect(result.currentPercentage).toBe(100);
    expect(result.status).toBe("strong");
    expect(result.shortfall).toBe(0);
  });

  it("returns adequate when savings are 50-99% of target", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 50000,
      currentSavings: 150000, // 50% of 300000 target
    });
    expect(result.status).toBe("adequate");
    expect(result.shortfall).toBe(150000);
  });

  it("returns inadequate when savings are below 50%", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 50000,
      currentSavings: 50000, // 16.7% of target
    });
    expect(result.status).toBe("inadequate");
  });

  it("handles zero monthly expenses gracefully", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 0,
      currentSavings: 100000,
    });
    expect(result.targetAmount).toBe(0);
    expect(result.currentPercentage).toBeNull();
    expect(result.monthsCurrentlyCovered).toBeNull();
  });

  it("respects custom months coverage", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 50000,
      currentSavings: 600000,
      monthsCoverage: 12,
    });
    expect(result.targetAmount).toBe(600000);
    expect(result.status).toBe("strong");
  });

  it("reports surplus when savings exceed target", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 50000,
      currentSavings: 500000, // 166% of 300k target
    });
    expect(result.surplus).toBe(200000);
    expect(result.shortfall).toBe(0);
  });

  it("handles negative savings safely (treated as zero)", () => {
    const result = calculateEmergencyFund({
      monthlyExpenses: 50000,
      currentSavings: -10000,
    });
    expect(result.currentPercentage).toBe(0);
    expect(result.status).toBe("inadequate");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Summary Aggregation
// ─────────────────────────────────────────────────────────────────────────────

describe("calculateDashboardSummary", () => {
  it("correctly computes surplus and savings rate", () => {
    const result = calculateDashboardSummary({
      monthlyIncome: 100000,
      monthlyExpenses: 60000,
      monthlyInvestmentBudget: 20000,
      annualInsuranceBudget: 50000,
      totalActivePolicies: 2,
      totalActiveInvestments: 3,
      totalAnnualPremium: 40000,
      totalMonthlyInvestment: 15000,
      totalGoals: 4,
      upcomingRenewalsCount: 1,
    });
    expect(result.monthlySurplus).toBe(40000);
    expect(result.savingsRatePct).toBe(40); // 40000/100000 = 40%
    expect(result.insuranceBudgetUtilizationPct).toBe(80); // 40000/50000 = 80%
    expect(result.investmentBudgetUtilizationPct).toBe(75); // 15000/20000 = 75%
  });

  it("returns null surplus when income is missing", () => {
    const result = calculateDashboardSummary({
      monthlyIncome: null,
      monthlyExpenses: 60000,
      totalActivePolicies: 0,
      totalActiveInvestments: 0,
      totalAnnualPremium: 0,
      totalMonthlyInvestment: 0,
      totalGoals: 0,
      upcomingRenewalsCount: 0,
    });
    expect(result.monthlySurplus).toBeNull();
    expect(result.savingsRatePct).toBeNull();
  });

  it("returns null budget utilization when budget is zero", () => {
    const result = calculateDashboardSummary({
      monthlyIncome: 100000,
      monthlyExpenses: 60000,
      annualInsuranceBudget: 0,
      monthlyInvestmentBudget: 0,
      totalActivePolicies: 0,
      totalActiveInvestments: 0,
      totalAnnualPremium: 10000,
      totalMonthlyInvestment: 5000,
      totalGoals: 0,
      upcomingRenewalsCount: 0,
    });
    expect(result.insuranceBudgetUtilizationPct).toBeNull();
    expect(result.investmentBudgetUtilizationPct).toBeNull();
  });

  it("passes through portfolio counts unchanged", () => {
    const result = calculateDashboardSummary({
      totalActivePolicies: 5,
      totalActiveInvestments: 3,
      totalAnnualPremium: 0,
      totalMonthlyInvestment: 0,
      totalGoals: 7,
      upcomingRenewalsCount: 2,
    });
    expect(result.totalActivePolicies).toBe(5);
    expect(result.totalActiveInvestments).toBe(3);
    expect(result.totalGoals).toBe(7);
    expect(result.upcomingRenewalsCount).toBe(2);
  });
});
