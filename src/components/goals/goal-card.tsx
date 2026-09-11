import { GoalOverview } from "@/types/goal";
import { formatCurrency } from "@/lib/financial/calculations";
import { MoreHorizontal, Pencil, Trash2, Calendar, Target, AlertCircle } from "lucide-react";
import { useState } from "react";

interface GoalCardProps {
  overview: GoalOverview;
  baseCurrency: string;
  onEdit: (g: GoalOverview["goal"]) => void;
  onDelete: (g: GoalOverview["goal"]) => void;
}

export function GoalCard({ overview, baseCurrency, onEdit, onDelete }: GoalCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { goal, progressPercentage, isReached } = overview;

  // Format type string to display
  const formatType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Status mapping
  let statusText = goal.status.charAt(0).toUpperCase() + goal.status.slice(1);
  let statusColor = "bg-muted text-foreground";
  
  if (goal.status === "completed" || isReached) {
    statusText = "Completed";
    statusColor = "bg-emerald-500/10 text-emerald-600";
  } else if (goal.status === "paused") {
    statusColor = "bg-orange-500/10 text-orange-600";
  } else if (goal.status === "active") {
    statusColor = "bg-primary/10 text-primary";
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg tracking-tight mb-1">{goal.name}</h3>
          <div className="flex flex-wrap gap-2 items-center text-xs">
            <span className={`font-medium px-2 py-0.5 rounded-full ${statusColor}`}>
              {statusText}
            </span>
            <span className="text-muted-foreground px-2 py-0.5 bg-muted rounded-full flex items-center gap-1">
              <Target className="size-3" />
              {formatType(goal.goal_type)}
            </span>
            {goal.priority === 'high' && (
              <span className="text-orange-600 px-2 py-0.5 bg-orange-500/10 rounded-full flex items-center gap-1">
                <AlertCircle className="size-3" /> High Priority
              </span>
            )}
          </div>
        </div>
        
        <div className="relative shrink-0">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 -mr-1.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
            aria-label="Goal actions"
            aria-expanded={showMenu}
          >
            <MoreHorizontal className="size-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-popover border border-border rounded-lg shadow-lg py-1 z-10">
              <button
                onClick={() => { setShowMenu(false); onEdit(goal); }}
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted flex items-center gap-2"
              >
                <Pencil className="size-3.5" /> Edit
              </button>
              <button
                onClick={() => { setShowMenu(false); onDelete(goal); }}
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted text-destructive flex items-center gap-2"
              >
                <Trash2 className="size-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex justify-between items-end mb-2 tabular-nums">
          <div>
            <p className="text-2xl font-semibold tracking-tight leading-none text-primary">
              {formatCurrency(goal.current_amount, baseCurrency)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              of {formatCurrency(goal.target_amount, baseCurrency)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">
              {isReached ? "100% complete" : `${Math.round(progressPercentage)}% complete`}
            </p>
          </div>
        </div>

        <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-4">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${isReached ? 'bg-emerald-500' : 'bg-primary'}`} 
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-label={`${goal.name} progress`}
            aria-valuenow={Math.round(progressPercentage)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-3 border-t border-border/50">
          <Calendar className="size-3.5" />
          {goal.target_date 
            ? `Target: ${new Date(goal.target_date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}` 
            : "No target date"}
        </div>
      </div>
    </div>
  );
}
