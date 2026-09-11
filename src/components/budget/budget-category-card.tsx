import { BudgetOverview } from "@/types/budget";
import { formatCurrency } from "@/lib/financial/calculations";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface BudgetCategoryCardProps {
  overview: BudgetOverview;
  baseCurrency: string;
  onEdit: (b: BudgetOverview["budget"]) => void;
  onDelete: (b: BudgetOverview["budget"]) => void;
}

export function BudgetCategoryCard({ overview, baseCurrency, onEdit, onDelete }: BudgetCategoryCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { budget, spent, remaining, percentageUsed, status } = overview;

  // Status mapping
  let statusText = "On track";
  let statusColor = "text-emerald-500 bg-emerald-500/10";
  let barColor = "bg-emerald-500";
  
  if (status === "over_budget") {
    statusText = "Over budget";
    statusColor = "text-destructive bg-destructive/10";
    barColor = "bg-destructive";
  } else if (status === "near_limit") {
    statusText = "Near limit";
    statusColor = "text-orange-500 bg-orange-500/10";
    barColor = "bg-orange-500";
  }

  // Safe percentage for visual rendering
  const clampedPercentage = Math.min(percentageUsed, 100);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-base tracking-tight">{budget.category}</h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor}`}>
            {statusText}
          </span>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 -mr-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
            aria-label="Budget actions"
            aria-expanded={showMenu}
          >
            <MoreHorizontal className="size-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-popover border border-border rounded-lg shadow-lg py-1 z-10">
              <button
                onClick={() => { setShowMenu(false); onEdit(budget); }}
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted flex items-center gap-2"
              >
                <Pencil className="size-3.5" /> Edit
              </button>
              <button
                onClick={() => { setShowMenu(false); onDelete(budget); }}
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted text-destructive flex items-center gap-2"
              >
                <Trash2 className="size-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-end mb-3 tabular-nums">
        <div>
          <p className="text-2xl font-semibold tracking-tight leading-none">
            {formatCurrency(spent, baseCurrency)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            of {formatCurrency(budget.amount, baseCurrency)} limit
          </p>
        </div>
        <div className="text-right">
          <p className={`text-sm font-medium ${remaining < 0 ? 'text-destructive' : 'text-foreground'}`}>
            {formatCurrency(remaining, baseCurrency)} left
          </p>
        </div>
      </div>

      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${barColor}`} 
          style={{ width: `${clampedPercentage}%` }}
          role="progressbar"
          aria-label={`${budget.category} budget usage`}
          aria-valuenow={Math.round(clampedPercentage)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      
      {spent === 0 && (
        <p className="text-xs text-muted-foreground mt-3">
          No transactions recorded for this category this month.
        </p>
      )}
    </div>
  );
}
