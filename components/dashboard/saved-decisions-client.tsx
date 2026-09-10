"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/app/lib/firebase-client";
import { loadSavedDecisions } from "@/app/(app)/decide/actions";
import type { DecisionRecordRow } from "@/lib/types/decision";
import { ArrowRight, Bookmark, Loader2 } from "lucide-react";

export function SavedDecisionsClient() {
  const [decisions, setDecisions] = useState<DecisionRecordRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        setDecisions([]);
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const data = await loadSavedDecisions(token);
        setDecisions(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <section aria-labelledby="saved-decisions-heading">
        <h3 id="saved-decisions-heading" className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Your Decisions
        </h3>
        <div className="flex h-24 items-center justify-center rounded-xl border border-border bg-card">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  if (error) {
    return null; // Silent fail or show simple error in MVP
  }

  if (decisions.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="saved-decisions-heading">
      <h3 id="saved-decisions-heading" className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Your Decisions
      </h3>
      <div className="space-y-2">
        {decisions.map((decision) => (
          <Link
            key={decision.id}
            href={`/decisions/${decision.id}`}
            className="group flex items-start justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3.5 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                <Bookmark className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  {decision.product_type} • Score: {decision.suitability_score ?? "N/A"}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">
                  {decision.decision_context.productName}
                </p>
                <p className="text-xs text-muted-foreground">
                  Saved on {new Date(decision.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </section>
  );
}
