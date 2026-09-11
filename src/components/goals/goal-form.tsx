import { useState } from "react";
import { Goal, CreateGoalInput, UpdateGoalInput, GoalType, GoalPriority, GoalStatus } from "@/types/goal";
import { X, Loader2 } from "lucide-react";

interface GoalFormProps {
  initialData?: Goal;
  onSubmit: (data: CreateGoalInput | UpdateGoalInput) => Promise<void>;
  onClose: () => void;
  baseCurrency: string;
}

export function GoalForm({ initialData, onSubmit, onClose, baseCurrency }: GoalFormProps) {
  const isEditing = !!initialData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(initialData?.name || "");
  const [goalType, setGoalType] = useState<GoalType>(initialData?.goal_type || "custom");
  const [targetAmount, setTargetAmount] = useState<string>(initialData?.target_amount.toString() || "");
  const [currentAmount, setCurrentAmount] = useState<string>(initialData?.current_amount.toString() || "0");
  const [targetDate, setTargetDate] = useState<string>(initialData?.target_date || "");
  const [priority, setPriority] = useState<GoalPriority>(initialData?.priority || "medium");
  const [status, setStatus] = useState<GoalStatus>(initialData?.status || "active");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!name.trim()) {
      setError("Goal name is required.");
      return;
    }

    const parsedTarget = parseFloat(targetAmount);
    if (isNaN(parsedTarget) || parsedTarget <= 0) {
      setError("Target amount must be a positive number.");
      return;
    }

    const parsedCurrent = parseFloat(currentAmount);
    if (isNaN(parsedCurrent) || parsedCurrent < 0) {
      setError("Current amount must be zero or a positive number.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: name.trim(),
        goal_type: goalType,
        target_amount: parsedTarget,
        current_amount: parsedCurrent,
        target_date: targetDate || null,
        priority,
        status
      };

      if (isEditing) {
        await onSubmit({ id: initialData!.id, ...payload });
      } else {
        await onSubmit(payload);
      }
      
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col my-auto max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-border/50 shrink-0">
          <h2 className="text-lg font-medium tracking-tight">
            {isEditing ? "Edit Goal" : "Add Financial Goal"}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
            disabled={loading}
          >
            <X className="size-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 md:p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Goal Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="e.g. Dream Vacation"
              />
            </div>

            {/* Target Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Amount ({baseCurrency})</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full h-11 px-4 bg-background border border-border rounded-xl text-lg font-medium tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all tabular-nums"
                placeholder="0.00"
              />
            </div>

            {/* Current Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount Saved ({baseCurrency})</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm font-medium tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all tabular-nums"
                placeholder="0.00"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Goal Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Goal Type</label>
                <select
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value as GoalType)}
                  className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                >
                  <option value="emergency_fund">Emergency Fund</option>
                  <option value="retirement">Retirement</option>
                  <option value="house">House</option>
                  <option value="car">Car</option>
                  <option value="education">Education</option>
                  <option value="travel">Travel</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {/* Target Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as GoalPriority)}
                  className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as GoalStatus)}
                  className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-border/50">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 flex items-center justify-center bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-5 animate-spin" /> : "Save goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
