"use client";

import { useState, type FormEvent } from "react";
import { Loader2, X } from "lucide-react";
import type { Investment } from "@/lib/types/portfolio";
import type { AddInvestmentInput } from "@/lib/portfolio/schemas";

interface InvestmentFormProps {
  initial?: Partial<Investment>;
  onSave: (data: AddInvestmentInput) => Promise<void>;
  onCancel: () => void;
  title: string;
}

export function InvestmentForm({ initial, onSave, onCancel, title }: InvestmentFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const fd = new FormData(e.currentTarget);
    const amountRaw = fd.get("amount") as string;

    const payload: AddInvestmentInput = {
      investment_type: fd.get("investment_type") as AddInvestmentInput["investment_type"],
      provider: (fd.get("provider") as string).trim() || undefined,
      scheme_name: (fd.get("scheme_name") as string).trim(),
      amount: amountRaw ? parseFloat(amountRaw) : undefined,
      frequency: (fd.get("frequency") as AddInvestmentInput["frequency"]) || undefined,
      start_date: (fd.get("start_date") as string) || undefined,
      status: (fd.get("status") as AddInvestmentInput["status"]) ?? "active",
    };

    if (!payload.investment_type || !payload.scheme_name) {
      setError("Investment type and name are required.");
      setSaving(false);
      return;
    }
    if (payload.amount !== undefined && isNaN(payload.amount)) {
      setError("Amount must be a valid number.");
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

          {/* Type + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="investment_type" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Type <span className="text-destructive">*</span>
              </label>
              <select
                id="investment_type"
                name="investment_type"
                required
                defaultValue={initial?.investment_type ?? ""}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="" disabled>Select type</option>
                <option value="mutual_fund">Mutual Fund</option>
                <option value="sip">SIP</option>
                <option value="stock">Stock</option>
                <option value="etf">ETF</option>
                <option value="fd">Fixed Deposit</option>
                <option value="nps">NPS</option>
                <option value="other">Other</option>
              </select>
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

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="scheme_name" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Name / Scheme <span className="text-destructive">*</span>
            </label>
            <input
              id="scheme_name"
              name="scheme_name"
              type="text"
              required
              placeholder="e.g. SBI Bluechip Fund"
              defaultValue={initial?.scheme_name ?? ""}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Provider */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="provider" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Provider / AMC
            </label>
            <input
              id="provider"
              name="provider"
              type="text"
              placeholder="Optional — e.g. SBI Mutual Fund"
              defaultValue={initial?.provider ?? ""}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Amount + Frequency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="amount" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Amount (₹)
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="any"
                placeholder="Invested amount"
                defaultValue={initial?.amount ?? ""}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <p className="text-[10px] text-muted-foreground">This is the invested amount, not current value.</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="frequency" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Frequency
              </label>
              <select
                id="frequency"
                name="frequency"
                defaultValue={initial?.frequency ?? ""}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="one_time">One Time</option>
              </select>
            </div>
          </div>

          {/* Start Date */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="start_date" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Start Date
            </label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              defaultValue={initial?.start_date?.slice(0, 10) ?? ""}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
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
              {saving ? "Saving..." : "Save Investment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
