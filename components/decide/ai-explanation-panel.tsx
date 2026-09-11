"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2, AlertTriangle, HelpCircle, Loader2, Database } from "lucide-react";
import { firebaseAuth } from "@/app/lib/firebase-client";
import type { ExplanationResponse } from "@/lib/ai/schemas";

interface AIExplanationPanelProps {
  productIds: string[];
}

export function AIExplanationPanel({ productIds }: AIExplanationPanelProps) {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<ExplanationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleExplain() {
    if (productIds.length === 0) return;
    
    setLoading(true);
    setError(null);
    setExplanation(null);

    try {
      let token = "";
      if (firebaseAuth.currentUser) {
        token = await firebaseAuth.currentUser.getIdToken();
      }

      const res = await fetch("/api/ai/explain-decision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ productIds }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to fetch AI explanation.");
      }

      const data: ExplanationResponse = await res.json();
      setExplanation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI explanation is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30 px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-5 w-5 text-indigo-500" />
          <h3 className="text-sm font-semibold text-foreground">
            AI Explanation
          </h3>
        </div>
        {!explanation && !loading && (
          <button
            type="button"
            onClick={handleExplain}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 px-4 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Explain this decision
          </button>
        )}
      </div>

      <div className="px-6 py-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
            <p className="mt-4 text-sm font-medium text-foreground">Generating explanation...</p>
            <p className="mt-1 text-xs text-muted-foreground">Analyzing product facts and profile match.</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {explanation && !loading && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Summary */}
            <div className="text-sm text-foreground leading-relaxed">
              <p>{explanation.summary}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Why it matches */}
              <div className="space-y-3">
                <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Why it may fit
                </h4>
                <ul className="space-y-2">
                  {explanation.whyItMatches.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/50" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What to consider */}
              <div className="space-y-3">
                <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-foreground">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  What to consider
                </h4>
                <ul className="space-y-2">
                  {explanation.whatToConsider.map((caution, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/50" />
                      {caution}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Questions to check */}
            <div className="space-y-3 pt-4 border-t border-border">
              <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-foreground">
                <HelpCircle className="h-3.5 w-3.5 text-blue-500" />
                Questions to check before buying
              </h4>
              <ul className="space-y-2">
                {explanation.questionsToAsk.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500/50" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust disclaimer */}
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 mt-6">
              <div className="flex items-start gap-3">
                <Database className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                    Important
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    This explanation is based on NIRNAY reference data and its deterministic suitability model.
                    It is not a guarantee of approval, coverage, or returns. It does not constitute regulated financial advice.
                    Actual pricing and eligibility must be verified with the provider.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && !explanation && !error && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Click &quot;Explain this decision&quot; to generate an AI-powered summary of these results based on your profile.
          </p>
        )}
      </div>
    </div>
  );
}
