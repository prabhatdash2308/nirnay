"use client";

import { useState, useEffect } from "react";
import { getBudgetOverview, createBudget, updateBudget, deleteBudget } from "@/services/budget";
import { getDashboardData } from "@/services/financial-profile";
import { CreateBudgetInput, UpdateBudgetInput, BudgetOverview, BudgetSummary as BudgetSummaryType, Budget } from "@/types/budget";
import { BudgetSkeleton } from "./budget-skeleton";
import { BudgetEmptyState } from "./budget-empty-state";
import { BudgetSummary } from "./budget-summary";
import { BudgetCategoryList } from "./budget-category-list";
import { BudgetForm } from "./budget-form";
import { DeleteBudgetDialog } from "./delete-budget-dialog";
import { Plus, RefreshCcw } from "lucide-react";

export function BudgetPageContent() {
  const [overviews, setOverviews] = useState<BudgetOverview[]>([]);
  const [summary, setSummary] = useState<BudgetSummaryType | null>(null);
  const [baseCurrency, setBaseCurrency] = useState("INR");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>(undefined);
  const [deletingBudget, setDeletingBudget] = useState<Budget | undefined>(undefined);
  
  // Period context - defaulting to current calendar month
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  const currentYear = currentDate.getFullYear();
  
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [budgetData, profile] = await Promise.all([
        getBudgetOverview(currentMonth, currentYear),
        getDashboardData()
      ]);
      setOverviews(budgetData.overviews);
      setSummary(budgetData.summary);
      setBaseCurrency(profile.financialProfile.baseCurrency);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load your budget data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentMonth, currentYear]);

  const handleCreate = async (data: CreateBudgetInput | UpdateBudgetInput) => {
    await createBudget(data as CreateBudgetInput);
    await fetchData(); // Refresh data to recalculate spending
  };

  const handleUpdate = async (data: CreateBudgetInput | UpdateBudgetInput) => {
    await updateBudget(data as UpdateBudgetInput);
    await fetchData(); // Refresh data to recalculate bounds
  };

  const handleDelete = async () => {
    if (!deletingBudget) return;
    await deleteBudget(deletingBudget.id);
    await fetchData();
    setDeletingBudget(undefined);
  };

  const openAddForm = () => {
    setEditingBudget(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (b: Budget) => {
    setEditingBudget(b);
    setIsFormOpen(true);
  };

  if (loading) {
    return <BudgetSkeleton />;
  }

  if (error || !summary) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-3xl bg-card min-h-[400px]">
        <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <span className="text-destructive font-bold text-xl">!</span>
        </div>
        <h3 className="text-lg font-medium mb-2">Unable to load budget</h3>
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Budget</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Set spending limits and see how you're tracking in {monthName}.
          </p>
        </div>
        {overviews.length > 0 && (
          <button 
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity w-full md:w-auto shrink-0"
          >
            <Plus className="size-4" />
            Set budget
          </button>
        )}
      </div>

      {overviews.length > 0 ? (
        <>
          <BudgetSummary summary={summary} baseCurrency={baseCurrency} />
          
          <BudgetCategoryList 
            overviews={overviews} 
            baseCurrency={baseCurrency} 
            onEdit={openEditForm}
            onDelete={setDeletingBudget}
          />
        </>
      ) : (
        <BudgetEmptyState onAddBudget={openAddForm} />
      )}

      {/* Forms and Dialogs */}
      {isFormOpen && (
        <BudgetForm
          initialData={editingBudget}
          baseCurrency={baseCurrency}
          periodMonth={currentMonth}
          periodYear={currentYear}
          onClose={() => setIsFormOpen(false)}
          onSubmit={editingBudget ? handleUpdate : handleCreate}
        />
      )}

      {deletingBudget && (
        <DeleteBudgetDialog
          budget={deletingBudget}
          baseCurrency={baseCurrency}
          onCancel={() => setDeletingBudget(undefined)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
