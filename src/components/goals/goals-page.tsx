"use client";

import { useState, useEffect } from "react";
import { getGoals, createGoal, updateGoal, deleteGoal, calculateGoalsSummary } from "@/services/goals";
import { getDashboardData } from "@/services/financial-profile";
import { Goal, CreateGoalInput, UpdateGoalInput, GoalOverview, GoalsSummary as GoalsSummaryType } from "@/types/goal";
import { GoalSkeleton } from "./goal-skeleton";
import { GoalEmptyState } from "./goal-empty-state";
import { GoalsSummary } from "./goals-summary";
import { GoalCard } from "./goal-card";
import { GoalForm } from "./goal-form";
import { DeleteGoalDialog } from "./delete-goal-dialog";
import { Plus, RefreshCcw } from "lucide-react";

export function GoalsPageContent() {
  const [overviews, setOverviews] = useState<GoalOverview[]>([]);
  const [summary, setSummary] = useState<GoalsSummaryType | null>(null);
  const [baseCurrency, setBaseCurrency] = useState("INR");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>(undefined);
  const [deletingGoal, setDeletingGoal] = useState<Goal | undefined>(undefined);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [goalsList, profile] = await Promise.all([
        getGoals(),
        getDashboardData()
      ]);
      
      const { overviews, summary } = calculateGoalsSummary(goalsList);
      
      setOverviews(overviews);
      setSummary(summary);
      setBaseCurrency(profile.financialProfile.baseCurrency);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load your goals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (data: CreateGoalInput | UpdateGoalInput) => {
    await createGoal(data as CreateGoalInput);
    await fetchData(); 
  };

  const handleUpdate = async (data: CreateGoalInput | UpdateGoalInput) => {
    await updateGoal(data as UpdateGoalInput);
    await fetchData(); 
  };

  const handleDelete = async () => {
    if (!deletingGoal) return;
    await deleteGoal(deletingGoal.id);
    await fetchData();
    setDeletingGoal(undefined);
  };

  const openAddForm = () => {
    setEditingGoal(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (g: Goal) => {
    setEditingGoal(g);
    setIsFormOpen(true);
  };

  if (loading) {
    return <GoalSkeleton />;
  }

  if (error || !summary) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-3xl bg-card min-h-[400px]">
        <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <span className="text-destructive font-bold text-xl">!</span>
        </div>
        <h3 className="text-lg font-medium mb-2">Unable to load goals</h3>
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
    <div className="space-y-6 md:space-y-8 pb-24 md:pb-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Goals</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Turn the things that matter to you into clear financial milestones.
          </p>
        </div>
        {overviews.length > 0 && (
          <button 
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:opacity-90 transition-opacity w-full md:w-auto shrink-0"
          >
            <Plus className="size-4" />
            Add goal
          </button>
        )}
      </div>

      {overviews.length > 0 ? (
        <>
          <GoalsSummary summary={summary} baseCurrency={baseCurrency} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pt-4">
            {overviews.map(overview => (
              <GoalCard 
                key={overview.goal.id}
                overview={overview}
                baseCurrency={baseCurrency}
                onEdit={openEditForm}
                onDelete={setDeletingGoal}
              />
            ))}
          </div>
        </>
      ) : (
        <GoalEmptyState onAddGoal={openAddForm} />
      )}

      {/* Forms and Dialogs */}
      {isFormOpen && (
        <GoalForm
          initialData={editingGoal}
          baseCurrency={baseCurrency}
          onClose={() => setIsFormOpen(false)}
          onSubmit={editingGoal ? handleUpdate : handleCreate}
        />
      )}

      {deletingGoal && (
        <DeleteGoalDialog
          goal={deletingGoal}
          onCancel={() => setDeletingGoal(undefined)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
