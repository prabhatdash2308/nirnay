import { Loader2 } from "lucide-react";
import { Transaction } from "@/types/transaction";
import { formatCurrency } from "@/lib/financial/calculations";
import { useState } from "react";

interface DeleteTransactionDialogProps {
  transaction: Transaction;
  baseCurrency: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function DeleteTransactionDialog({ transaction, baseCurrency, onConfirm, onCancel }: DeleteTransactionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      await onConfirm();
    } catch (err: any) {
      setError(err.message || "Failed to delete transaction.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-sm rounded-2xl shadow-xl border border-border overflow-hidden p-6">
        <h3 className="text-lg font-medium tracking-tight mb-2">Delete Transaction?</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Are you sure you want to delete this transaction? This action cannot be undone.
        </p>
        
        <div className="p-4 bg-muted/50 rounded-xl mb-6 flex justify-between items-center text-sm border border-border/50">
          <span className="font-medium truncate mr-4">{transaction.description}</span>
          <span className="shrink-0 font-medium tabular-nums text-muted-foreground">
            {formatCurrency(transaction.amount, baseCurrency)}
          </span>
        </div>

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
