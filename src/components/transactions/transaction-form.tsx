import { useState, useEffect } from "react";
import { Transaction, CreateTransactionInput, UpdateTransactionInput, TransactionType } from "@/types/transaction";
import { getCategoriesForType } from "@/lib/financial/categories";
import { X, Loader2 } from "lucide-react";

interface TransactionFormProps {
  initialData?: Transaction;
  onSubmit: (data: CreateTransactionInput | UpdateTransactionInput) => Promise<void>;
  onClose: () => void;
  baseCurrency: string;
}

export function TransactionForm({ initialData, onSubmit, onClose, baseCurrency }: TransactionFormProps) {
  const isEditing = !!initialData;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [type, setType] = useState<TransactionType>(initialData?.type || "expense");
  const [amount, setAmount] = useState<string>(initialData?.amount.toString() || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [date, setDate] = useState(initialData?.transaction_date || new Date().toISOString().split('T')[0]);
  
  const [category, setCategory] = useState(
    initialData?.category || getCategoriesForType(type)[0]
  );
  
  const [note, setNote] = useState(initialData?.note || "");

  // Update category list when type changes
  useEffect(() => {
    if (!isEditing || (isEditing && type !== initialData?.type)) {
      setCategory(getCategoriesForType(type)[0]);
    }
  }, [type, isEditing, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }
    
    if (!date) {
      setError("Date is required.");
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        type,
        amount: parsedAmount,
        description: description.trim(),
        transaction_date: date,
        category,
        note: note.trim() || null,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h2 className="text-lg font-medium tracking-tight">
            {isEditing ? "Edit Transaction" : "Add Transaction"}
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

          <div className="space-y-5">
            {/* Type Toggle */}
            <div className="flex p-1 bg-muted rounded-xl">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${type === "expense" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${type === "income" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Income
              </button>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount ({baseCurrency})</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-11 px-4 bg-background border border-border rounded-xl text-lg font-medium tracking-tight focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all tabular-nums"
                placeholder="0.00"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="e.g. Groceries at Whole Foods"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                  required
                >
                  {getCategoriesForType(type).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-11 px-4 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Note (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none h-24"
                placeholder="Add any extra details here..."
              />
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-border/50">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 flex items-center justify-center bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? <Loader2 className="size-5 animate-spin" /> : (isEditing ? "Save changes" : "Add transaction")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
