import { DashboardData } from "@/types/dashboard";
import { formatCurrency, calculateGoalProgress } from "@/lib/financial/calculations";
import { Target } from "lucide-react";

export function GoalsOverview({ data }: { data: DashboardData }) {
  const { goals } = data;
  const { baseCurrency } = data.financialProfile;

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-medium tracking-tight">Active Goals</h3>
        <Target className="size-5 text-muted-foreground/50" />
      </div>

      {goals.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-muted/30 rounded-xl border border-border/50">
          <Target className="size-8 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium">No active goals</p>
          <p className="text-xs text-muted-foreground mt-1">
            You haven't set any financial goals yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map(goal => {
            const progress = calculateGoalProgress(goal.currentAmount, goal.targetAmount);
            
            return (
              <div key={goal.id} className="p-4 rounded-xl border border-border/60 hover:bg-muted/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm">{goal.name}</span>
                  <span className="text-sm font-medium tabular-nums">
                    {formatCurrency(goal.currentAmount, baseCurrency)}
                  </span>
                </div>
                
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-primary transition-all duration-1000 ease-out" 
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{progress.toFixed(0)}% funded</span>
                  <span>Goal: {formatCurrency(goal.targetAmount, baseCurrency)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
