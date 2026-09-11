import { Plus, Target } from "lucide-react";

interface GoalEmptyStateProps {
  onAddGoal: () => void;
}

export function GoalEmptyState({ onAddGoal }: GoalEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/60 rounded-2xl bg-card min-h-[400px]">
      <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Target className="size-8 text-primary" />
      </div>
      <h3 className="text-xl font-medium tracking-tight mb-3">No goals yet</h3>
      <p className="text-muted-foreground max-w-sm mx-auto mb-8">
        Set a financial goal to give your money a clear destination.
      </p>
      <button 
        onClick={onAddGoal}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity"
      >
        <Plus className="size-5" />
        Add your first goal
      </button>
    </div>
  );
}
