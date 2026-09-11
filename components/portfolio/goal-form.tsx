"use client";

import { useState, type FormEvent } from "react";
import { Loader2, X } from "lucide-react";
import type { FinancialGoal } from "@/lib/types/portfolio";
import type { AddGoalInput } from "@/lib/portfolio/schemas";

interface GoalFormProps {
  initial?: Partial<FinancialGoal>;
  onSave: (data: AddGoalInput) => Promise<void>;
  onCancel: () => void;
  title: string;
}

export function GoalForm({ initial, onSave, onCancel, title }: GoalFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const fd = new FormData(e.currentTarget);
    const targetRaw = fd.get("target_amount") as string;
    const currentRaw = fd.get("current_amount") as string;

    const targetAmount = parseFloat(targetRaw);
    const currentAmount = parseFloat(currentRaw || "0");

    if (isNaN(targetAmount) || targetAmount <= 0) {
      setError("Target amount must be a positive number.");
      setSaving(false);
      return;
    }
    if (isNaN(currentAmount) || currentAmount < 0) {
      setError("Current amount must be zero or a positive number.");
      setSaving(false);
      return;
    }

    const payload: AddGoalInput = {
      name: (fd.get("name") as string).trim(),
      goal_type: fd.get("goal_type") as AddGoalInput["goal_type"],
      target_amount: targetAmount,
      current_amount: currentAmount,
      target_date: (fd.get("target_date") as string) || undefined,
      priority: (fd.get("priority") as AddGoalInput["priority"]) ?? "medium",
      status: (fd.get("status") as AddGoalInput["status"]) ?? "active",
    };

    if (!payload.name || !payload.goal_type) {
      setError("Goal name and type are required.");
      setSaving(false);
      return;
    }

    try {
      await onSave(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <button
            onClick={onCancel}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive border border-destructive/20">
              {error}
            </p>
          )}

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Goal Name <span className="text-destructive">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g. Emergency Fund, Retirement"
              defaultValue={initial?.name ?? ""}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Type + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="goal_type" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Type <span className="text-destructive">*</span>
              </label>
              <select
                id="goal_type"
                name="goal_type"
                required
                defaultValue={initial?.goal_type ?? "custom"}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="emergency_fund">Emergency Fund</option>
                <option value="retirement">Retirement</option>
                <option value="house">House</option>
                <option value="car">Car</option>
                <option value="education">Education</option>
                <option value="travel">Travel</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="priority" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                defaultValue={initial?.priority ?? "medium"}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Amounts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="target_amount" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Target Amount (₹) <span className="text-destructive">*</span>
              </label>
              <input
                id="target_amount"
                name="target_amount"
                type="number"
                min="1"
                step="any"
                required
                placeholder="e.g. 500000"
                defaultValue={initial?.target_amount ?? ""}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="current_amount" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Current Saved (₹)
              </label>
              <input
                id="current_amount"
                name="current_amount"
                type="number"
                min="0"
                step="any"
                placeholder="0"
                defaultValue={initial?.current_amount ?? 0}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Target Date + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="target_date" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Target Date
              </label>
              <input
                id="target_date"
                name="target_date"
                type="date"
                defaultValue={initial?.target_date?.slice(0, 10) ?? ""}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="status" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={initial?.status ?? "active"}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Saving..." : "Save Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
