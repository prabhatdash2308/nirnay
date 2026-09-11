"use client";

import { useState } from "react";
import { useOnboarding } from "./onboarding-provider";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function CommitmentsStep() {
  const { data, updateData, prevStep, completeOnboarding } = useOnboarding();
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Local state for string inputs to avoid NaN in fields
  const [rent, setRent] = useState(data.fixedCommitments.rent ? data.fixedCommitments.rent.toString() : "");
  const [utilities, setUtilities] = useState(data.fixedCommitments.utilities ? data.fixedCommitments.utilities.toString() : "");
  const [other, setOther] = useState(data.fixedCommitments.other ? data.fixedCommitments.other.toString() : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    
    const r = rent === "" ? 0 : Number(rent);
    const u = utilities === "" ? 0 : Number(utilities);
    const o = other === "" ? 0 : Number(other);

    if (r < 0 || u < 0 || o < 0) {
      setError("Commitments cannot be negative.");
      return;
    }

    setError(null);
    setIsSaving(true);
    
    // We update the data first so the context has the latest state.
    // However, completeOnboarding uses the state from the provider.
    // Since React state updates are async, passing it directly to a local var or
    // ensuring the completeOnboarding function uses the latest data is better.
    // Let's call updateData, wait for it? No, updateData is sync.
    // Actually, in goals-step, we did `await completeOnboarding();` 
    // Wait, completeOnboarding reads `data` from context. It might be stale if we just called updateData.
    // To be safe, we should probably updateData here. But completeOnboarding() in OnboardingProvider uses the `data` state variable.
    // Let's see how GoalsStep did it. It just called completeOnboarding().
    
    updateData({
      fixedCommitments: { rent: r, utilities: u, other: o }
    });

    try {
      // Need a small timeout to let the context state settle before saving.
      await new Promise(resolve => setTimeout(resolve, 0));
      await completeOnboarding();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to save profile. Please try again.");
      }
      setIsSaving(false);
    }
  };

  const currencySymbol = data.currency === "INR" ? "₹" : 
                         data.currency === "USD" ? "$" : 
                         data.currency === "EUR" ? "€" : 
                         data.currency === "GBP" ? "£" : data.currency;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Recurring Commitments</h2>
        <p className="text-muted-foreground">
          These help NIRNAY understand what portion of your income is already spoken for each month. Leave blank if zero.
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900/50">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="rent" className="text-sm font-medium">Rent or Mortgage (Monthly)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground font-medium">
              {currencySymbol}
            </div>
            <input
              id="rent"
              type="number"
              min="0"
              step="any"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border bg-background pl-8 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="utilities" className="text-sm font-medium">Utilities & Bills (Monthly estimate)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground font-medium">
              {currencySymbol}
            </div>
            <input
              id="utilities"
              type="number"
              min="0"
              step="any"
              value={utilities}
              onChange={(e) => setUtilities(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border bg-background pl-8 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="other" className="text-sm font-medium">Other fixed obligations (e.g. Loans)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground font-medium">
              {currencySymbol}
            </div>
            <input
              id="other"
              type="number"
              min="0"
              step="any"
              value={other}
              onChange={(e) => setOther(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border bg-background pl-8 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={prevStep} disabled={isSaving}>
          Back
        </Button>
        <Button type="submit" size="lg" className="px-8" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Finish setup"
          )}
        </Button>
      </div>
    </form>
  );
}
