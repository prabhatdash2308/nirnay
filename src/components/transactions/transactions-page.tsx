"use client";

import { useState, useEffect, useMemo } from "react";
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from "@/services/transactions";
import { getDashboardData } from "@/services/financial-profile";
import { Transaction, CreateTransactionInput, UpdateTransactionInput } from "@/types/transaction";
import { TransactionList } from "./transaction-list";
import { TransactionForm } from "./transaction-form";
import { TransactionFilters, FilterState } from "./transaction-filters";
import { TransactionEmptyState } from "./transaction-empty-state";
import { TransactionSkeleton } from "./transaction-skeleton";
import { DeleteTransactionDialog } from "./delete-transaction-dialog";
import { Plus, RefreshCcw } from "lucide-react";

export function TransactionsPageContent() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [baseCurrency, setBaseCurrency] = useState("INR");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | undefined>(undefined);
  
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    type: "all",
    sort: "newest"
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      // We load profile context in parallel to get the base currency
      const [txs, profile] = await Promise.all([
        getTransactions(),
        getDashboardData()
      ]);
      setTransactions(txs);
      setBaseCurrency(profile.financialProfile.baseCurrency);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (data: CreateTransactionInput | UpdateTransactionInput) => {
    const created = await createTransaction(data as CreateTransactionInput);
    setTransactions(prev => [created, ...prev]);
  };

  const handleUpdate = async (data: CreateTransactionInput | UpdateTransactionInput) => {
    const updated = await updateTransaction(data as UpdateTransactionInput);
    setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const handleDelete = async () => {
    if (!deletingTransaction) return;
    await deleteTransaction(deletingTransaction.id);
    setTransactions(prev => prev.filter(t => t.id !== deletingTransaction.id));
    setDeletingTransaction(undefined);
  };

  const openAddForm = () => {
    setEditingTransaction(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (t: Transaction) => {
    setEditingTransaction(t);
    setIsFormOpen(true);
  };

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Filter Type
    if (filters.type !== "all") {
      result = result.filter(t => t.type === filters.type);
    }

    // Filter Search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(t => 
        t.description.toLowerCase().includes(q) || 
        t.category.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sort) {
        case "newest":
          return new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime();
        case "oldest":
          return new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime();
        case "highest":
          return b.amount - a.amount;
        case "lowest":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return result;
  }, [transactions, filters]);

  const isFiltered = filters.search !== "" || filters.type !== "all";
  const clearFilters = () => setFilters({ search: "", type: "all", sort: "newest" });

  if (loading) {
    return (
      <div className="space-y-6 md:space-y-8 pb-8">
        <TransactionSkeleton />
      </div>
    );
  }

  if (error && transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-3xl bg-card min-h-[400px]">
        <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <span className="text-destructive font-bold text-xl">!</span>
        </div>
        <h3 className="text-lg font-medium mb-2">Unable to load transactions</h3>
        <p className="text-muted-foreground text-sm max-w-sm mb-6">{error}</p>
        <button 
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <RefreshCcw className="size-4" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 md:pb-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Track where your money is coming from and where it's going.</p>
        </div>
        <button 
          onClick={openAddForm}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity w-full md:w-auto shrink-0"
        >
          <Plus className="size-4" />
          Add transaction
        </button>
      </div>

      {transactions.length > 0 ? (
        <>
          <TransactionFilters filters={filters} onChange={setFilters} />
          
          {filteredTransactions.length > 0 ? (
            <TransactionList 
              transactions={filteredTransactions} 
              baseCurrency={baseCurrency} 
              onEdit={openEditForm}
              onDelete={(t) => setDeletingTransaction(t)}
            />
          ) : (
            <TransactionEmptyState 
              onAddTransaction={openAddForm} 
              isFiltered={isFiltered} 
              onClearFilters={clearFilters} 
            />
          )}
        </>
      ) : (
        <TransactionEmptyState 
          onAddTransaction={openAddForm} 
          isFiltered={false} 
          onClearFilters={clearFilters} 
        />
      )}

      {/* Forms and Dialogs */}
      {isFormOpen && (
        <TransactionForm
          initialData={editingTransaction}
          baseCurrency={baseCurrency}
          onClose={() => setIsFormOpen(false)}
          onSubmit={editingTransaction ? handleUpdate : handleCreate}
        />
      )}

      {deletingTransaction && (
        <DeleteTransactionDialog
          transaction={deletingTransaction}
          baseCurrency={baseCurrency}
          onCancel={() => setDeletingTransaction(undefined)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
