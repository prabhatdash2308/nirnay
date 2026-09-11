import { DashboardData } from "@/types/dashboard";
import { formatCurrency, calculateRemainingCashFlow } from "@/lib/financial/calculations";
import { PieChart } from "lucide-react";

export function CashFlowOverview({ data }: { data: DashboardData }) {
  const { monthlyIncome: plannedIncome, monthlyExpenses: plannedExpenses, baseCurrency } = data.financialProfile;
  const transactions = data.transactions || [];

  // Calculate actuals
  const actualIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const actualExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  
  const remaining = calculateRemainingCashFlow(actualIncome, actualExpenses) ?? 0;
  
  // Calculate relative widths
  const maxAmount = Math.max(actualIncome, plannedIncome ?? 0, actualExpenses, plannedExpenses ?? 0);
  const incomeWidth = maxAmount > 0 ? (actualIncome / maxAmount) * 100 : 0;
  const expenseWidth = maxAmount > 0 ? (actualExpenses / maxAmount) * 100 : 0;

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-medium tracking-tight">Cash Flow Status</h3>
        {data.budgetStatus && (
          <div className={`text-xs px-2 py-1 rounded-full ${data.budgetStatus.summary.categoriesOverBudget > 0 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
            <span className="flex items-center gap-1"><PieChart className="size-3" /> Budget active</span>
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-6">Actual income and expenses this month</p>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div>
              <span className="font-medium text-muted-foreground block">Income</span>
              {plannedIncome && <span className="text-[10px] text-muted-foreground/70">Planned: {formatCurrency(plannedIncome, baseCurrency)}</span>}
            </div>
            <span className="font-medium tabular-nums">{formatCurrency(actualIncome, baseCurrency)}</span>
          </div>
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-1000 ease-out rounded-full" 
              style={{ width: `${incomeWidth}%` }}
              role="progressbar"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div>
              <span className="font-medium text-muted-foreground block">Expenses</span>
              {plannedExpenses && <span className="text-[10px] text-muted-foreground/70">Planned: {formatCurrency(plannedExpenses, baseCurrency)}</span>}
            </div>
            <span className="font-medium tabular-nums">{formatCurrency(actualExpenses, baseCurrency)}</span>
          </div>
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500/80 transition-all duration-1000 ease-out rounded-full" 
              style={{ width: `${expenseWidth}%` }}
              role="progressbar"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-center text-sm">
        <span className="text-muted-foreground">Current Surplus</span>
        <span className={`font-medium tabular-nums ${remaining >= 0 ? 'text-primary' : 'text-destructive'}`}>
          {formatCurrency(remaining, baseCurrency)}
        </span>
      </div>
    </div>
  );
}
