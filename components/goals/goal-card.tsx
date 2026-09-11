import { calculateGoalProgress } from "@/lib/goals/calculations";
import { calcDaysFromToday, calcUrgency, formatDaysLabel } from "@/lib/calendar/calculations";
import type { FinancialGoal } from "@/lib/types/portfolio";
import { formatCurrency } from "@/lib/portfolio/calculations";
import { AlertCircle, Calendar as CalendarIcon, Edit, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GoalCardProps {
  goal: FinancialGoal;
  onEdit: (goal: FinancialGoal) => void;
}

export function GoalCard({ goal, onEdit }: GoalCardProps) {
  const progressPercent = calculateGoalProgress(goal.current_amount, goal.target_amount);
  
  // Calculate Target Date Urgency
  let dateLabel = "No target date";
  let isUrgent = false;
  
  if (goal.target_date) {
    const daysFromToday = calcDaysFromToday(goal.target_date);
    const urgency = calcUrgency(daysFromToday);
    dateLabel = formatDaysLabel(daysFromToday);
    
    if (urgency === "overdue" || urgency === "today" || urgency === "this_week") {
      isUrgent = true;
    }
  }

  // Calculate Remaining
  const remaining = Math.max(0, goal.target_amount - goal.current_amount);
  const showRemaining = goal.target_amount > 0 && remaining > 0;

  return (
    <div className={`relative flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted/50 ${isUrgent ? 'border-red-200 shadow-sm' : ''}`}>
      {/* Urgency Highlight Bar */}
      {isUrgent && (
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
      )}
      
      <div className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {goal.goal_type.replace(/_/g, " ")}
              </span>
              {goal.status !== "active" && (
                <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full uppercase">
                  {goal.status}
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              {goal.name}
            </h3>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onEdit(goal)}>
            <Edit className="w-4 h-4 text-muted-foreground" />
            <span className="sr-only">Edit Goal</span>
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Progress Display */}
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-bold">
              {formatCurrency(goal.current_amount)}
            </span>
            <span className="text-sm text-muted-foreground">
              / {formatCurrency(goal.target_amount)}
            </span>
          </div>
          
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-in-out" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-primary">
              {Math.round(progressPercent)}% complete
            </span>
            {showRemaining && (
              <span className="text-muted-foreground">
                {formatCurrency(remaining)} remaining
              </span>
            )}
          </div>
        </div>

        {/* Target Date Details */}
        {goal.target_date && (
          <div className="pt-4 border-t flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarIcon className="w-4 h-4" />
              <span>Target: {new Date(goal.target_date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}</span>
            </div>
            <div className={`font-medium flex items-center gap-1 ${isUrgent ? 'text-red-600' : 'text-muted-foreground'}`}>
              {isUrgent && <AlertCircle className="w-3.5 h-3.5" />}
              {dateLabel}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
