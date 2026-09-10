import { describe, it, expect } from "vitest";
import {
  calculateTotalCoverage,
  calculateTotalInvested,
  calculateGoalProgress,
  generateAttentionItems,
} from "./calculations";
import type { InsurancePolicy, Investment } from "../types/portfolio";

describe("Portfolio Calculations", () => {
  describe("calculateTotalCoverage", () => {
    it("sums active policy sum_insured safely", () => {
      const policies: Partial<InsurancePolicy>[] = [
        { status: "active", sum_insured: 1000 },
        { status: "active", sum_insured: 2000 },
        { status: "expired", sum_insured: 5000 }, // ignored
        { status: "active", sum_insured: null },  // ignored safely
      ];
      expect(calculateTotalCoverage(policies as InsurancePolicy[])).toBe(3000);
    });

    it("returns 0 for empty array", () => {
      expect(calculateTotalCoverage([])).toBe(0);
    });
  });

  describe("calculateTotalInvested", () => {
    it("sums active and paused investment amounts", () => {
      const investments: Partial<Investment>[] = [
        { status: "active", amount: 100 },
        { status: "paused", amount: 50 }, // paused still counts as invested
        { status: "cancelled", amount: 200 }, // ignored
        { status: "active", amount: null },
      ];
      expect(calculateTotalInvested(investments as Investment[])).toBe(150);
    });
  });

  describe("calculateGoalProgress", () => {
    it("calculates progress correctly and clamps to 100", () => {
      expect(calculateGoalProgress(50, 100)).toBe(50);
      expect(calculateGoalProgress(150, 100)).toBe(100);
    });

    it("returns 0 if target is 0 or negative", () => {
      expect(calculateGoalProgress(50, 0)).toBe(0);
      expect(calculateGoalProgress(50, -10)).toBe(0);
    });

    it("returns 0 if current is negative", () => {
      expect(calculateGoalProgress(-10, 100)).toBe(0);
    });
  });

  describe("generateAttentionItems", () => {
    it("generates renewal warning for policies within 30 days", () => {
      const now = new Date();
      const in15Days = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
      
      const policies: Partial<InsurancePolicy>[] = [
        { id: 1, policy_type: "health", policy_name: "My Health", status: "active", renewal_date: in15Days.toISOString() },
      ];
      
      const items = generateAttentionItems(policies as InsurancePolicy[], [], []);
      expect(items.length).toBe(1);
      expect(items[0].id).toBe("renewal-1");
      expect(items[0].severity).toBe("warning");
    });
  });
});
