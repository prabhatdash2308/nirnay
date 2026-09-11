import { BudgetSummary as BudgetSummaryType } from "@/types/budget";
import { formatCurrency } from "@/lib/financial/calculations";

interface BudgetSummaryProps {
  summary: BudgetSummaryType;
  baseCurrency: string;
}

export function BudgetSummary({ summary, baseCurrency }: BudgetSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Budgeted</h3>
        <p className="text-3xl font-semibold tracking-tight tabular-nums">
          {formatCurrency(summary.totalBudgeted, baseCurrency)}
        </p>
      </div>
      
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Spent</h3>
        <p className="text-3xl font-semibold tracking-tight tabular-nums">
          {formatCurrency(summary.totalSpent, baseCurrency)}
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Remaining</h3>
          <p className={`text-3xl font-semibold tracking-tight tabular-nums ${summary.totalRemaining < 0 ? 'text-destructive' : 'text-primary'}`}>
            {formatCurrency(summary.totalRemaining, baseCurrency)}
          </p>
        </div>
        
        {summary.categoriesOverBudget > 0 && (
          <div className="mt-4 inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
            {summary.categoriesOverBudget} {summary.categoriesOverBudget === 1 ? 'category' : 'categories'} over budget
          </div>
        )}
      </div>
    </div>
  );
}
