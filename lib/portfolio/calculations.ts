import type { InsurancePolicy, Investment, FinancialGoal } from "@/lib/types/portfolio";

// ─────────────────────────────────────────────────────────────────────────────
// Calculation Utilities
// ─────────────────────────────────────────────────────────────────────────────

export function calculateTotalCoverage(policies: InsurancePolicy[]): number {
  return policies
    .filter((p) => p.status === "active")
    .reduce((sum, p) => sum + (p.sum_insured ?? 0), 0);
}

export function calculateTotalInvested(investments: Investment[]): number {
  return investments
    .filter((i) => i.status === "active" || i.status === "paused")
    .reduce((sum, i) => sum + (i.amount ?? 0), 0);
}

export function calculateGoalProgress(current: number, target: number): number {
  if (target <= 0) return 0;
  if (current < 0) return 0;
  
  const rawProgress = (current / target) * 100;
  
  if (Number.isNaN(rawProgress) || !Number.isFinite(rawProgress)) {
    return 0;
  }
  
  return Math.min(100, Math.max(0, Math.round(rawProgress)));
}

// ─────────────────────────────────────────────────────────────────────────────
// Needs Attention Logic
// ─────────────────────────────────────────────────────────────────────────────

export interface AttentionItem {
  id: string;
  title: string;
  detail: string;
  href: string;
  severity: "info" | "warning" | "important";
}

export function generateAttentionItems(
  policies: InsurancePolicy[],
  investments: Investment[],
  goals: FinancialGoal[]
): AttentionItem[] {
  const items: AttentionItem[] = [];
  const now = new Date();

  // 1. Upcoming Renewals (within 30 days)
  for (const policy of policies) {
    if (policy.status === "active" && policy.renewal_date) {
      const renewalDate = new Date(policy.renewal_date);
      const diffTime = renewalDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays <= 30) {
        items.push({
          id: `renewal-${policy.id}`,
          title: `${policy.policy_type === "health" ? "Health" : "Insurance"} renewal upcoming`,
          detail: `${policy.policy_name} renews in ${diffDays} days.`,
          href: "/portfolio", // In future, maybe /portfolio/policies/[id]
          severity: diffDays <= 7 ? "important" : "warning",
        });
      } else if (diffDays < 0) {
        items.push({
          id: `expired-${policy.id}`,
          title: `Policy expired`,
          detail: `${policy.policy_name} renewal is overdue by ${Math.abs(diffDays)} days.`,
          href: "/portfolio",
          severity: "important",
        });
      }
    }
  }

  // 2. Missing Current Value context on Investments
  // (We use this strictly to inform the user why performance isn't tracked)
  const activeInvestments = investments.filter(i => i.status === "active");
  if (activeInvestments.length > 0) {
    items.push({
      id: "investments-no-performance",
      title: "Performance tracking unavailable",
      detail: "Current-value tracking is not yet connected to your investments.",
      href: "/portfolio",
      severity: "info",
    });
  }

  // 3. Goal behind (Very simplistic heuristic for demonstration)
  // If a goal is active and target_date is in the past but progress < 100
  for (const goal of goals) {
    if (goal.status === "active" && goal.target_date) {
      const targetDate = new Date(goal.target_date);
      const progress = calculateGoalProgress(goal.current_amount, goal.target_amount);
      
      if (targetDate < now && progress < 100) {
        items.push({
          id: `goal-overdue-${goal.id}`,
          title: `Goal target date passed`,
          detail: `Your "${goal.name}" goal was targeted for ${targetDate.toLocaleDateString()}, but is at ${progress}% progress.`,
          href: "/portfolio",
          severity: "warning",
        });
      }
    }
  }

  return items;
}
