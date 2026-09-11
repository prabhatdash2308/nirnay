import { ArrowRightLeft } from "lucide-react";
import { DashboardData } from "@/types/dashboard";
import { formatCurrency } from "@/lib/financial/calculations";

export function RecentActivity({ data }: { data: DashboardData }) {
  const transactions = data.transactions || [];
  const recentTransactions = transactions.slice(0, 5);

  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm p-6 flex flex-col h-full min-h-[300px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-medium tracking-tight">Recent Activity</h3>
      </div>

      {recentTransactions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border/60 rounded-xl bg-muted/10">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <ArrowRightLeft className="size-6 text-muted-foreground/50" />
          </div>
          <h4 className="text-sm font-medium mb-1">No transactions yet</h4>
          <p className="text-xs text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
            Your recent activity will appear here once transaction tracking is connected.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`size-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <ArrowRightLeft className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{tx.description}</p>
                  <p className="text-xs text-muted-foreground capitalize">{tx.category} • {formatDate(tx.transaction_date)}</p>
                </div>
              </div>
              <div className={`text-sm font-medium tabular-nums ${tx.type === 'income' ? 'text-primary' : 'text-foreground'}`}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, data.financialProfile.baseCurrency)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
