import { 
  ShieldCheck, 
  TrendingUp, 
  Target, 
  AlertCircle, 
  ShieldAlert,
  Car,
  HeartPulse,
  Landmark,
  PiggyBank
} from "lucide-react";
import type { InsurancePolicy, Investment, FinancialGoal } from "@/lib/types/portfolio";
import type { AttentionItem } from "@/lib/portfolio/calculations";
import { calculateGoalProgress } from "@/lib/portfolio/calculations";

function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return "N/A";
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function PolicyCard({ policy }: { policy: InsurancePolicy }) {
  const isHealth = policy.policy_type === "health";
  const isMotor = policy.policy_type === "motor";
  const Icon = isHealth ? HeartPulse : isMotor ? Car : ShieldCheck;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
            <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              {policy.provider} • {policy.policy_type}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">
              {policy.policy_name}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
            policy.status === "active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
            policy.status === "expired" ? "bg-red-500/10 text-red-600 dark:text-red-400" :
            "bg-muted text-muted-foreground"
          }`}>
            {policy.status}
          </span>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-4 rounded-lg bg-muted/40 p-3 text-xs">
        <div>
          <p className="text-muted-foreground">Coverage</p>
          <p className="mt-0.5 font-medium text-foreground">{formatCurrency(policy.sum_insured)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Premium ({policy.premium_frequency})</p>
          <p className="mt-0.5 font-medium text-foreground">{formatCurrency(policy.premium_amount)}</p>
        </div>
      </div>
    </div>
  );
}

export function InvestmentCard({ investment }: { investment: Investment }) {
  const isSip = investment.investment_type === "sip";
  const isMf = investment.investment_type === "mutual_fund";
  const Icon = isSip ? TrendingUp : isMf ? Landmark : PiggyBank;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
            <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              {investment.provider || "Self-managed"} • {investment.investment_type.replace('_', ' ')}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-foreground line-clamp-1">
              {investment.scheme_name}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
            investment.status === "active" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
            investment.status === "paused" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
            "bg-muted text-muted-foreground"
          }`}>
            {investment.status}
          </span>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between rounded-lg bg-muted/40 p-3 text-xs">
        <div>
          <p className="text-muted-foreground">Amount Invested</p>
          <p className="mt-0.5 font-medium text-foreground">{formatCurrency(investment.amount)}</p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground">Frequency</p>
          <p className="mt-0.5 font-medium text-foreground capitalize">{investment.frequency || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}

export function GoalCard({ goal }: { goal: FinancialGoal }) {
  const progress = calculateGoalProgress(goal.current_amount, goal.target_amount);
  
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10">
            <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              {goal.goal_type.replace('_', ' ')}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">
              {goal.name}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-foreground">{progress}%</p>
        </div>
      </div>
      
      <div className="mt-2 space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatCurrency(goal.current_amount)}</span>
          <span>{formatCurrency(goal.target_amount)}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div 
            className="h-full bg-purple-500 transition-all duration-500 ease-in-out dark:bg-purple-400"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function AttentionItemCard({ item }: { item: AttentionItem }) {
  const isImportant = item.severity === "important";
  const isWarning = item.severity === "warning";
  
  const iconColor = isImportant ? "text-red-500" : isWarning ? "text-amber-500" : "text-blue-500";
  const Icon = isImportant ? ShieldAlert : AlertCircle;

  return (
    <div className="group flex items-start justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3.5 transition-colors hover:bg-muted/50">
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${iconColor}`} />
        <div>
          <p className="text-sm font-medium text-foreground">
            {item.title}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {item.detail}
          </p>
        </div>
      </div>
    </div>
  );
}
