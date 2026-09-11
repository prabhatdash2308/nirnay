import { GoalsSummary as GoalsSummaryType } from "@/types/goal";
import { formatCurrency } from "@/lib/financial/calculations";

interface GoalsSummaryProps {
  summary: GoalsSummaryType;
  baseCurrency: string;
}

export function GoalsSummary({ summary, baseCurrency }: GoalsSummaryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm">
        <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1 md:mb-2">Total Goals</h3>
        <p className="text-2xl md:text-3xl font-semibold tracking-tight tabular-nums">
          {summary.totalGoals}
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm">
        <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1 md:mb-2">Active Goals</h3>
        <p className="text-2xl md:text-3xl font-semibold tracking-tight tabular-nums text-primary">
          {summary.activeGoals}
        </p>
      </div>
      
      <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm col-span-2">
        <h3 className="text-xs md:text-sm font-medium text-muted-foreground mb-1 md:mb-2">Active Target</h3>
        <p className="text-2xl md:text-3xl font-semibold tracking-tight tabular-nums">
          {formatCurrency(summary.totalActiveTarget, baseCurrency)}
        </p>
      </div>
    </div>
  );
}
