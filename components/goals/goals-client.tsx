"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Plus, Target, PiggyBank, AlertTriangle } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/app/lib/firebase-client";
import type { FinancialGoal } from "@/lib/types/portfolio";
import { type AddGoalInput } from "@/lib/portfolio/schemas";
import {
  addFinancialGoal,
  updateFinancialGoal,
  deleteFinancialGoal,
} from "@/app/(app)/portfolio/manage-actions";
import { loadGoalsData } from "@/app/(app)/goals/actions";
import { calculateGoalsSummary } from "@/lib/goals/calculations";
import { formatCurrency } from "@/lib/portfolio/calculations";

import { Button } from "@/components/ui/button";
import { GoalForm } from "@/components/portfolio/goal-form";
import { GoalCard } from "./goal-card";
import { ConfirmDeleteDialog } from "@/components/portfolio/confirm-delete-dialog";

export function GoalsClient() {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [deletingGoalId, setDeletingGoalId] = useState<number | null>(null);

  const [idToken, setIdToken] = useState<string | null>(null);

  const fetchGoals = useCallback(async (token: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await loadGoalsData(token);
      setGoals(data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while loading your goals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        setGoals([]);
        setIdToken(null);
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        setIdToken(token);
        await fetchGoals(token);
      } catch (err) {
        console.error("Failed to authenticate goals request:", err);
        setError("Failed to authenticate.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchGoals]);

  // Handlers
  async function handleAddGoal(input: AddGoalInput) {
    if (!idToken) return;
    await addFinancialGoal(idToken, input);
    await fetchGoals(idToken);
    setIsAddOpen(false);
  }

  async function handleUpdateGoal(input: AddGoalInput) {
    if (!editingGoal || !idToken) return;
    await updateFinancialGoal(idToken, editingGoal.id, input);
    await fetchGoals(idToken);
    setEditingGoal(null);
  }

  async function handleDeleteGoal(id: number) {
    if (!idToken) return;
    await deleteFinancialGoal(idToken, id);
    await fetchGoals(idToken);
    setDeletingGoalId(null);
    if (editingGoal?.id === id) {
      setEditingGoal(null);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">Loading goals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-bold mb-2">Unable to load goals</h3>
        <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
        <Button onClick={() => idToken && fetchGoals(idToken)}>Try Again</Button>
      </div>
    );
  }

  const summary = calculateGoalsSummary(goals);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Goals</h1>
          <p className="text-muted-foreground">
            Turn your financial priorities into measurable progress.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Goal
        </Button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="pb-2 flex flex-row items-center justify-between space-y-0">
            <h3 className="text-sm font-medium text-muted-foreground">Active Goals</h3>
            <Target className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">{summary.activeCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently tracked priorities</p>
          </div>
        </div>
        
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="pb-2 flex flex-row items-center justify-between space-y-0">
            <h3 className="text-sm font-medium text-muted-foreground">Total Target</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalTarget)}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all active goals</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="pb-2 flex flex-row items-center justify-between space-y-0">
            <h3 className="text-sm font-medium text-muted-foreground">Total Saved</h3>
            <PiggyBank className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{formatCurrency(summary.totalSaved)}</div>
            <p className="text-xs text-muted-foreground mt-1">Current accumulated progress</p>
          </div>
        </div>

        <div className={`rounded-xl border border-border bg-card p-6 shadow-sm ${summary.needsAttentionCount > 0 ? "border-red-200 bg-red-50/50" : ""}`}>
          <div className="pb-2 flex flex-row items-center justify-between space-y-0">
            <h3 className="text-sm font-medium text-muted-foreground">Needs Attention</h3>
            <AlertTriangle className={`w-4 h-4 ${summary.needsAttentionCount > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
          </div>
          <div>
            <div className="text-2xl font-bold">{summary.needsAttentionCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Goals due soon or overdue</p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      {goals.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center py-16 text-center border-dashed">
          <Target className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No financial goals yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Create a goal and turn an important priority into a concrete plan.
          </p>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Goal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onEdit={setEditingGoal} />
          ))}
        </div>
      )}

      {/* Add Dialog */}
      {isAddOpen && (
        <GoalForm
          onSave={handleAddGoal}
          onCancel={() => setIsAddOpen(false)}
          title="Create Goal"
        />
      )}

      {/* Edit Dialog */}
      {editingGoal && (
        <GoalForm
          initial={editingGoal}
          onSave={handleUpdateGoal}
          onCancel={() => setEditingGoal(null)}
          onDelete={async (id) => setDeletingGoalId(id)}
          title="Edit Goal"
        />
      )}

      {/* Delete Confirmation */}
      {deletingGoalId !== null && (
        <ConfirmDeleteDialog
          title="Delete Goal"
          description="Are you sure you want to delete this goal? This action cannot be undone."
          onConfirm={() => handleDeleteGoal(deletingGoalId)}
          onCancel={() => setDeletingGoalId(null)}
        />
      )}
    </div>
  );
}
