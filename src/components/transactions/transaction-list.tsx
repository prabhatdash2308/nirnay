import { Transaction } from "@/types/transaction";
import { TransactionRow } from "./transaction-row";

interface TransactionListProps {
  transactions: Transaction[];
  baseCurrency: string;
  onEdit: (t: Transaction) => void;
  onDelete: (t: Transaction) => void;
}

export function TransactionList({ transactions, baseCurrency, onEdit, onDelete }: TransactionListProps) {
  // Group by month/year could be added here later, but a simple list is requested for now.
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-muted/30 border-b border-border/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <div className="col-span-6">Transaction</div>
        <div className="col-span-3 text-right">Amount</div>
        <div className="col-span-3 text-right">Actions</div>
      </div>
      
      <div className="flex flex-col">
        {transactions.map(t => (
          <TransactionRow 
            key={t.id} 
            transaction={t} 
            baseCurrency={baseCurrency} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))}
      </div>
    </div>
  );
}
