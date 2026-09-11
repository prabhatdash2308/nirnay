"use client";

import { useState } from "react";
import { useOnboarding } from "./onboarding-provider";
import { Button } from "@/components/ui/button";
import { IncomeFrequency } from "@/types/onboarding";

const frequencies: { value: IncomeFrequency; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "weekly", label: "Weekly" },
  { value: "yearly", label: "Yearly" },
  { value: "irregular", label: "Irregular / Variable" },
];

export function IncomeStep() {
  const { data, updateData, nextStep, prevStep } = useOnboarding();
  const [error, setError] = useState<string | null>(null);

  // Local state for the input to handle empty string properly before parsing to number
  const [inputValue, setInputValue] = useState(data.incomeAmount === null ? "" : data.incomeAmount.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = inputValue === "" ? null : Number(inputValue);
    
    if (amount !== null && amount < 0) {
      setError("Income cannot be negative.");
      return;
    }

    if (amount !== null && !data.incomeFrequency) {
      setError("Please select how often you receive this income.");
      return;
    }

    setError(null);
    updateData({ incomeAmount: amount });
    nextStep();
  };

  // Get symbol based on currency
  const currencySymbol = data.currency === "INR" ? "₹" : 
                         data.currency === "USD" ? "$" : 
                         data.currency === "EUR" ? "€" : 
                         data.currency === "GBP" ? "£" : data.currency;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">What is your baseline income?</h2>
        <p className="text-muted-foreground">
          An estimate is completely fine. NIRNAY uses this to project your safe-to-spend limits. You can always update it later.
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900/50">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="incomeAmount" className="text-sm font-medium">
            Approximate Amount (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground font-medium">
              {currencySymbol}
            </div>
            <input
              id="incomeAmount"
              type="number"
              min="0"
              step="any"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-border bg-background pl-8 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="incomeFrequency" className="text-sm font-medium">
            How often do you receive this?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {frequencies.map((freq) => (
              <button
                key={freq.value}
                type="button"
                onClick={() => updateData({ incomeFrequency: freq.value })}
                className={`flex h-11 items-center justify-center rounded-xl border text-sm transition-colors ${
                  data.incomeFrequency === freq.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:bg-muted text-foreground"
                }`}
              >
                {freq.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={prevStep}>
          Back
        </Button>
        <Button type="submit" size="lg" className="px-8">
          Continue
        </Button>
      </div>
    </form>
  );
}
