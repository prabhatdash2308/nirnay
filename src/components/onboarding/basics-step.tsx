"use client";

import { useState } from "react";
import { useOnboarding } from "./onboarding-provider";
import { Button } from "@/components/ui/button";

const currencies = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
];

export function BasicsStep() {
  const { data, updateData, nextStep } = useOnboarding();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.displayName.trim()) {
      setError("Please enter a display name.");
      return;
    }
    setError(null);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-2">Let's set up your financial starting point.</h2>
        <p className="text-muted-foreground">
          NIRNAY uses this baseline to make your financial insights relevant. We don't ask for sensitive account numbers.
        </p>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900/50">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="displayName" className="text-sm font-medium">
            What should we call you?
          </label>
          <input
            id="displayName"
            type="text"
            value={data.displayName}
            onChange={(e) => updateData({ displayName: e.target.value })}
            className="flex h-11 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            placeholder="e.g. Alex"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="currency" className="text-sm font-medium">
            Primary Currency
          </label>
          <select
            id="currency"
            value={data.currency}
            onChange={(e) => updateData({ currency: e.target.value })}
            className="flex h-11 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.symbol}) - {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" size="lg" className="w-full sm:w-auto px-8">
          Continue
        </Button>
      </div>
    </form>
  );
}
