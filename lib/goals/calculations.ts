import type { FinancialGoal } from "@/lib/types/portfolio";
import { calcDaysFromToday, calcUrgency } from "../../lib/calendar/calculations";

// ─────────────────────────────────────────────────────────────────────────────
// Core Progress Utility
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculates the progress of a financial goal as a percentage.
 * 
 * Rules:
 * - If target is 0 or negative, returns 100 (goal met) if current >= 0.
 * - Handles missing or negative current amounts safely.
 * - Progress is strictly clamped between 0 and 100.
 */
export function calculateGoalProgress(
  currentAmount: number,
  targetAmount: number
): number {
  if (targetAmount <= 0) {
    return currentAmount >= 0 ? 100 : 0;
  }
  
  if (currentAmount <= 0) {
    return 0;
  }
  
  const rawPercentage = (currentAmount / targetAmount) * 100;
  
  // Clamp between 0 and 100
  return Math.min(100, Math.max(0, rawPercentage));
}

// ─────────────────────────────────────────────────────────────────────────────
// Summary Utilities
// ─────────────────────────────────────────────────────────────────────────────

export interface GoalsSummary {
  activeCount: number;
  totalTarget: number;
  totalSaved: number;
  needsAttentionCount: number;
}

/**
 * Calculates aggregate summary metrics for a list of goals.
 */
export function calculateGoalsSummary(goals: FinancialGoal[], today: Date = new Date()): GoalsSummary {
  let activeCount = 0;
  let totalTarget = 0;
  let totalSaved = 0;
  let needsAttentionCount = 0;

  for (const goal of goals) {
    if (goal.status !== "active") continue;
    
    activeCount++;
    totalTarget += Math.max(0, goal.target_amount);
    totalSaved += Math.max(0, goal.current_amount);
    
    if (goal.target_date) {
      const daysFromToday = calcDaysFromToday(goal.target_date, today);
      const urgency = calcUrgency(daysFromToday);
      
      // Reusing calendar "needs attention" threshold: overdue, today, this_week
      if (urgency === "overdue" || urgency === "today" || urgency === "this_week") {
        needsAttentionCount++;
      }
    }
  }

  return {
    activeCount,
    totalTarget,
    totalSaved,
    needsAttentionCount,
  };
}
