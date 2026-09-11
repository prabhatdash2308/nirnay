import { Loader2 } from "lucide-react";
import { Goal } from "@/types/goal";
import { useState } from "react";

interface DeleteGoalDialogProps {
  goal: Goal;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function DeleteGoalDialog({ goal, onConfirm, onCancel }: DeleteGoalDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      await onConfirm();
    } catch (err: any) {
      setError(err.message || "Failed to delete goal.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-sm rounded-2xl shadow-xl border border-border overflow-hidden p-6">
        <h3 className="text-lg font-medium tracking-tight mb-2">Delete {goal.name}?</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Your goal and its saved progress will be removed. This does not affect your actual transactions or account balances.
        </p>
        
        {error && (
          <div className="mb-6 p-3 bg-destructive/10 text-destructive text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 h-10 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 h-10 flex items-center justify-center bg-destructive text-destructive-foreground font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
