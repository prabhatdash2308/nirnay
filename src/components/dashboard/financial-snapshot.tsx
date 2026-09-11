import { DashboardData } from "@/types/dashboard";
import { formatCurrency, calculateRemainingCashFlow } from "@/lib/financial/calculations";

export function FinancialSnapshot({ data }: { data: DashboardData }) {
  const { monthlyIncome, monthlyExpenses, baseCurrency } = data.financialProfile;
  const remaining = calculateRemainingCashFlow(monthlyIncome, monthlyExpenses);

  const isMissingData = monthlyIncome === null || monthlyExpenses === null;

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm p-6 lg:p-8">
      <h2 className="text-lg font-medium tracking-tight mb-6">Financial Snapshot</h2>
      
      {isMissingData ? (
        <div className="p-4 bg-muted/50 rounded-xl border border-border/50 text-sm text-muted-foreground">
          Your financial profile is incomplete. Please update your income and expenses to view your snapshot.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-border/50">
          <div className="flex flex-col md:pr-8">
            <span className="text-sm font-medium text-muted-foreground mb-2">Monthly Income</span>
            <span className="text-3xl font-semibold tracking-tight tabular-nums">
              {formatCurrency(monthlyIncome, baseCurrency)}
            </span>
          </div>
          
          <div className="flex flex-col pt-6 md:pt-0 md:px-8">
            <span className="text-sm font-medium text-muted-foreground mb-2">Monthly Expenses</span>
            <span className="text-3xl font-semibold tracking-tight tabular-nums">
              {formatCurrency(monthlyExpenses, baseCurrency)}
            </span>
          </div>
          
          <div className="flex flex-col pt-6 md:pt-0 md:pl-8">
            <span className="text-sm font-medium text-muted-foreground mb-2">Remaining Cash Flow</span>
            <span className={`text-3xl font-semibold tracking-tight tabular-nums ${(remaining ?? 0) >= 0 ? "text-primary" : "text-destructive"}`}>
              {formatCurrency(remaining, baseCurrency)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
