import { Plus } from "lucide-react";

interface EmptyStateProps {
  onAddTransaction: () => void;
  isFiltered: boolean;
  onClearFilters: () => void;
}

export function TransactionEmptyState({ onAddTransaction, isFiltered, onClearFilters }: EmptyStateProps) {
  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/60 rounded-2xl bg-card min-h-[300px]">
        <h3 className="text-sm font-medium mb-1">No matches found</h3>
        <p className="text-xs text-muted-foreground mb-4">
          No transactions match your current filters.
        </p>
        <button 
          onClick={onClearFilters}
          className="text-sm text-primary font-medium hover:underline"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/60 rounded-2xl bg-card min-h-[300px]">
      <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Plus className="size-6 text-primary" />
      </div>
      <h3 className="text-base font-medium tracking-tight mb-2">No transactions yet</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
        Your transactions will appear here once you add your first transaction.
      </p>
      <button 
        onClick={onAddTransaction}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <Plus className="size-4" />
        Add your first transaction
      </button>
    </div>
  );
}
