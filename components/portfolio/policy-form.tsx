"use client";

import { useState, type FormEvent } from "react";
import { Loader2, X } from "lucide-react";
import type { InsurancePolicy } from "@/lib/types/portfolio";
import type { AddPolicyInput } from "@/lib/portfolio/schemas";

interface PolicyFormProps {
  initial?: Partial<InsurancePolicy>;
  onSave: (data: AddPolicyInput) => Promise<void>;
  onCancel: () => void;
  title: string;
}

export function PolicyForm({ initial, onSave, onCancel, title }: PolicyFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const fd = new FormData(e.currentTarget);
    const premiumRaw = fd.get("premium_amount") as string;
    const sumInsuredRaw = fd.get("sum_insured") as string;

    const payload: AddPolicyInput = {
      policy_type: fd.get("policy_type") as AddPolicyInput["policy_type"],
      provider: (fd.get("provider") as string).trim(),
      policy_name: (fd.get("policy_name") as string).trim(),
      policy_number: (fd.get("policy_number") as string).trim() || undefined,
      premium_amount: premiumRaw ? parseFloat(premiumRaw) : undefined,
      premium_frequency: (fd.get("premium_frequency") as AddPolicyInput["premium_frequency"]) || undefined,
      sum_insured: sumInsuredRaw ? parseFloat(sumInsuredRaw) : undefined,
      start_date: (fd.get("start_date") as string) || undefined,
      renewal_date: (fd.get("renewal_date") as string) || undefined,
      status: (fd.get("status") as AddPolicyInput["status"]) ?? "active",
    };

    // Client-side sanity checks
    if (!payload.policy_type || !payload.provider || !payload.policy_name) {
      setError("Policy type, provider, and name are required.");
      setSaving(false);
      return;
    }
    if (payload.premium_amount !== undefined && isNaN(payload.premium_amount)) {
      setError("Premium amount must be a valid number.");
      setSaving(false);
      return;
    }
    if (payload.sum_insured !== undefined && isNaN(payload.sum_insured)) {
      setError("Sum insured must be a valid number.");
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
        {/* Header */}
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
          {/* Error */}
          {error && (
            <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive border border-destructive/20">
              {error}
            </p>
          )}

          {/* Policy Type + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="policy_type" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Type <span className="text-destructive">*</span>
              </label>
              <select
                id="policy_type"
                name="policy_type"
                required
                defaultValue={initial?.policy_type ?? ""}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="" disabled>Select type</option>
                <option value="health">Health</option>
                <option value="motor">Motor</option>
                <option value="life">Life</option>
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
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Provider */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="provider" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Provider <span className="text-destructive">*</span>
            </label>
            <input
              id="provider"
              name="provider"
              type="text"
              required
              placeholder="e.g. HDFC ERGO, Star Health"
              defaultValue={initial?.provider ?? ""}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Policy Name + Number */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="policy_name" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Policy Name <span className="text-destructive">*</span>
              </label>
              <input
                id="policy_name"
                name="policy_name"
                type="text"
                required
                placeholder="e.g. Family Health Plan"
                defaultValue={initial?.policy_name ?? ""}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="policy_number" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Policy No.
              </label>
              <input
                id="policy_number"
                name="policy_number"
                type="text"
                placeholder="Optional"
                defaultValue={initial?.policy_number ?? ""}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Coverage */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="sum_insured" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Sum Insured (₹)
            </label>
            <input
              id="sum_insured"
              name="sum_insured"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 500000"
              defaultValue={initial?.sum_insured ?? ""}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Premium */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="premium_amount" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Premium (₹)
              </label>
              <input
                id="premium_amount"
                name="premium_amount"
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 12000"
                defaultValue={initial?.premium_amount ?? ""}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="premium_frequency" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Frequency
              </label>
              <select
                id="premium_frequency"
                name="premium_frequency"
                defaultValue={initial?.premium_frequency ?? ""}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="half_yearly">Half Yearly</option>
                <option value="yearly">Yearly</option>
                <option value="one_time">One Time</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
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
            <div className="flex flex-col gap-1.5">
              <label htmlFor="renewal_date" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Renewal Date
              </label>
              <input
                id="renewal_date"
                name="renewal_date"
                type="date"
                defaultValue={initial?.renewal_date?.slice(0, 10) ?? ""}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Actions */}
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
              {saving ? "Saving..." : "Save Policy"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
