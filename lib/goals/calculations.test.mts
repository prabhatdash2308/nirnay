import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { calculateGoalProgress, calculateGoalsSummary } from "./calculations";
import type { FinancialGoal } from "@/lib/types/portfolio";

describe("Goal Calculations", () => {
  describe("calculateGoalProgress", () => {
    it("returns 0 when current_amount is 0", () => {
      expect(calculateGoalProgress(0, 100)).toBe(0);
    });

    it("returns correct percentage for normal progress", () => {
      expect(calculateGoalProgress(50, 100)).toBe(50);
      expect(calculateGoalProgress(25, 200)).toBe(12.5);
    });

    it("clamps at 100 when current_amount exceeds target", () => {
      expect(calculateGoalProgress(150, 100)).toBe(100);
    });

    it("returns 100 when target is 0 and current is positive or zero", () => {
      expect(calculateGoalProgress(50, 0)).toBe(100);
      expect(calculateGoalProgress(0, 0)).toBe(100);
    });

    it("returns 0 when target is 0 and current is negative", () => {
      expect(calculateGoalProgress(-10, 0)).toBe(0);
    });

    it("returns 0 when current is negative and target is positive", () => {
      expect(calculateGoalProgress(-50, 100)).toBe(0);
    });

    it("returns 100 when target is negative and current is positive or zero", () => {
      expect(calculateGoalProgress(50, -100)).toBe(100);
      expect(calculateGoalProgress(0, -100)).toBe(100);
    });

    it("returns 0 when target is negative and current is negative", () => {
      expect(calculateGoalProgress(-50, -100)).toBe(0);
    });
  });

  describe("calculateGoalsSummary", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(Date.UTC(2026, 8, 1))); // 2026-09-01
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("returns empty summary when no goals", () => {
      const summary = calculateGoalsSummary([]);
      expect(summary).toEqual({
        activeCount: 0,
        totalTarget: 0,
        totalSaved: 0,
        needsAttentionCount: 0,
      });
    });

    it("ignores non-active goals", () => {
      const goals: FinancialGoal[] = [
        {
          id: 1,
          user_id: "u1",
          name: "Test",
          goal_type: "custom",
          target_amount: 100,
          current_amount: 50,
          target_date: null,
          priority: "medium",
          status: "completed", // not active
          created_at: "",
          updated_at: "",
          metadata: {},
        },
      ];
      const summary = calculateGoalsSummary(goals);
      expect(summary.activeCount).toBe(0);
      expect(summary.totalTarget).toBe(0);
    });

    it("aggregates active goals correctly", () => {
      const goals: FinancialGoal[] = [
        {
          id: 1,
          user_id: "u1",
          name: "G1",
          goal_type: "custom",
          target_amount: 1000,
          current_amount: 200,
          target_date: null,
          priority: "medium",
          status: "active",
          created_at: "",
          updated_at: "",
          metadata: {},
        },
        {
          id: 2,
          user_id: "u1",
          name: "G2",
          goal_type: "custom",
          target_amount: 500,
          current_amount: 600, // over saved
          target_date: null,
          priority: "medium",
          status: "active",
          created_at: "",
          updated_at: "",
          metadata: {},
        },
      ];
      
      const summary = calculateGoalsSummary(goals);
      expect(summary.activeCount).toBe(2);
      expect(summary.totalTarget).toBe(1500);
      expect(summary.totalSaved).toBe(800);
      expect(summary.needsAttentionCount).toBe(0);
    });

    it("counts needsAttention goals using calendar urgency", () => {
      const goals: FinancialGoal[] = [
        {
          id: 1,
          user_id: "u1",
          name: "Overdue",
          goal_type: "custom",
          target_amount: 100,
          current_amount: 0,
          target_date: "2026-08-01", // past
          priority: "medium",
          status: "active",
          created_at: "",
          updated_at: "",
          metadata: {},
        },
        {
          id: 2,
          user_id: "u1",
          name: "Today",
          goal_type: "custom",
          target_amount: 100,
          current_amount: 0,
          target_date: "2026-09-01", // today
          priority: "medium",
          status: "active",
          created_at: "",
          updated_at: "",
          metadata: {},
        },
        {
          id: 3,
          user_id: "u1",
          name: "This Week",
          goal_type: "custom",
          target_amount: 100,
          current_amount: 0,
          target_date: "2026-09-05", // 4 days later
          priority: "medium",
          status: "active",
          created_at: "",
          updated_at: "",
          metadata: {},
        },
        {
          id: 4,
          user_id: "u1",
          name: "Upcoming",
          goal_type: "custom",
          target_amount: 100,
          current_amount: 0,
          target_date: "2026-10-01", // 30 days later
          priority: "medium",
          status: "active",
          created_at: "",
          updated_at: "",
          metadata: {},
        },
      ];

      // Overdue, today, and this week are "needs attention" -> 3
      const summary = calculateGoalsSummary(goals, new Date(Date.UTC(2026, 8, 1)));
      expect(summary.needsAttentionCount).toBe(3);
    });
  });
});
