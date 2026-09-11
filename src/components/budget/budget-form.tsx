import { useState } from "react";
import { Budget, CreateBudgetInput, UpdateBudgetInput } from "@/types/budget";
import { EXPENSE_CATEGORIES, ExpenseCategory } from "@/lib/financial/categories";
import { X, Loader2 } from "lucide-react";

interface BudgetFormProps {
  initialData?: Budget;
  onSubmit: (data: CreateBudgetInput | UpdateBudgetInput) => Promise<void>;
  onClose: () => void;
  baseCurrency: string;
  periodMonth: number;
  periodYear: number;
}

export function BudgetForm({ initialData, onSubmit, onClose, baseCurrency, periodMonth, periodYear }: BudgetFormProps) {
  const isEditing = !!initialData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [category, setCategory] = useState<ExpenseCategory>(initialData?.category || EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState<string>(initialData?.amount.toString() || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      setError("Amount must be zero or a positive number.");
      return;
    }

    try {
      setLoading(true);

      if (isEditing) {
        await onSubmit({ 
          id: initialData!.id, 
          amount: parsedAmount 
        });
      } else {
        await onSubmit({
          category,
          amount: parsedAmount,
          period_month: periodMonth,
          period_year: periodYear
        });
      }
      
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-sm rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h2 className="text-lg font-medium tracking-tight">
            {isEditing ? "Edit Budget" : "Set Budget Limit"}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
            disabled={loading}
          >
            <X className="size-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 md:p-6">
          {error && (
            <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                required
                disabled={isEditing} // Category cannot be changed on edit, only amount
              >
                {EXPENSE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {isEditing && (
                <p className="text-xs text-muted-foreground mt-1">Category cannot be changed. Delete this budget to choose a different category.</p>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Monthly Limit ({baseCurrency})</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-11 px-4 bg-background border border-border rounded-xl text-lg font-medium tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all tabular-nums"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 flex items-center justify-center bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-5 animate-spin" /> : "Save budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
