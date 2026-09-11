import { Transaction } from "@/types/transaction";
import { formatCurrency } from "@/lib/financial/calculations";
import { MoreHorizontal, Pencil, Trash2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useState } from "react";

interface TransactionRowProps {
  transaction: Transaction;
  baseCurrency: string;
  onEdit: (t: Transaction) => void;
  onDelete: (t: Transaction) => void;
}

export function TransactionRow({ transaction, baseCurrency, onEdit, onDelete }: TransactionRowProps) {
  const [showMenu, setShowMenu] = useState(false);
  const isIncome = transaction.type === "income";

  // Close menu if clicked outside would be ideal, but for simplicity we'll just toggle.
  // In a real app we'd use a robust DropdownMenu primitive.
  
  return (
    <div className="flex items-center justify-between p-4 border-b border-border/50 hover:bg-muted/30 transition-colors group">
      <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
        <div className={`shrink-0 size-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
          {isIncome ? <ArrowDownRight className="size-5" /> : <ArrowUpRight className="size-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{transaction.description}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            <span className="truncate">{transaction.category}</span>
            <span>•</span>
            <span className="shrink-0">{new Date(transaction.transaction_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 shrink-0 ml-4">
        <span className={`text-sm font-medium tabular-nums ${isIncome ? 'text-emerald-500' : ''}`}>
          {isIncome ? '+' : '−'} {formatCurrency(transaction.amount, baseCurrency)}
        </span>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors md:opacity-0 md:group-hover:opacity-100 focus:opacity-100"
            aria-label="Transaction actions"
            aria-expanded={showMenu}
          >
            <MoreHorizontal className="size-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-popover border border-border rounded-lg shadow-lg py-1 z-10">
              <button
                onClick={() => { setShowMenu(false); onEdit(transaction); }}
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted flex items-center gap-2"
              >
                <Pencil className="size-3.5" /> Edit
              </button>
              <button
                onClick={() => { setShowMenu(false); onDelete(transaction); }}
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted text-destructive flex items-center gap-2"
              >
                <Trash2 className="size-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
