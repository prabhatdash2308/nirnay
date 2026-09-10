"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/app/lib/firebase-client";
import { loadDecisionById } from "@/app/(app)/decide/actions";
import type { DecisionRecordRow } from "@/lib/types/decision";
import { Loader2, ArrowLeft, Bookmark, CheckCircle2, AlertTriangle, ShieldCheck, TrendingUp, Info } from "lucide-react";
import { BAND_COLORS, BAND_LABELS, BAND_BG } from "@/lib/suitability/engine";
import type { SuitabilityBand } from "@/lib/suitability/engine";
import { cn } from "cn";

function scoreToBand(score: number): SuitabilityBand {
  if (score >= 75) return "strong_match";
  if (score >= 55) return "good_match";
  if (score >= 35) return "partial_match";
  return "low_match";
}

export function ViewDecisionClient({ id }: { id: number }) {
  const [decision, setDecision] = useState<DecisionRecordRow | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        router.push("/auth");
        return;
      }

      try {
        const token = await user.getIdToken();
        const data = await loadDecisionById(token, id);
        if (!data) {
          router.push("/dashboard");
          return;
        }
        setDecision(data);
      } catch (err) {
        console.error(err);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">Loading decision snapshot...</p>
      </div>
    );
  }

  if (!decision) return null;

  const { decision_context, suitability_score, product_type } = decision;
  const hasProfile = suitability_score !== null;
  const band: SuitabilityBand | null = hasProfile ? scoreToBand(suitability_score) : null;
  const ProductTypeIcon = product_type === "insurance" ? ShieldCheck : TrendingUp;

  return (
    <div className="space-y-6 pb-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Banner */}
        <div className="bg-muted/50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-border gap-4">
          <div className="flex items-center gap-2.5">
            <Bookmark className="h-5 w-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">Decision Snapshot</h3>
              <p className="text-xs text-muted-foreground">Saved on {new Date(decision.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          {hasProfile && band && (
            <div className={cn("flex items-center gap-2 rounded-full px-3 py-1.5", BAND_BG[band])}>
              <span className={cn("text-xs font-semibold", BAND_COLORS[band])}>
                {BAND_LABELS[band]}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                Score: {suitability_score}/100
              </span>
            </div>
          )}
        </div>

        <div className="p-6 space-y-8">
          {/* Product Info */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
              <ProductTypeIcon className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                {decision_context.productProvider}
              </p>
              <h4 className="mt-1 text-xl font-bold text-foreground">
                {decision_context.productName}
              </h4>
              {decision_context.tagline && (
                <p className="mt-1 text-sm text-muted-foreground">{decision_context.tagline}</p>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Why Matches */}
            <div className="space-y-3">
              <h5 className="text-xs font-semibold uppercase tracking-widest text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Context: Why it matched
              </h5>
              <ul className="space-y-2">
                {decision_context.whyItMatches.length > 0 ? (
                  decision_context.whyItMatches.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/50" />
                      {reason}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground italic">No specific alignments found at the time.</li>
                )}
              </ul>
            </div>

            {/* Cautions */}
            <div className="space-y-3">
              <h5 className="text-xs font-semibold uppercase tracking-widest text-foreground flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                Context: Cautions
              </h5>
              <ul className="space-y-2">
                {decision_context.cautions.length > 0 ? (
                  decision_context.cautions.map((caution, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/50" />
                      {caution}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground italic">No specific cautions identified at the time.</li>
                )}
              </ul>
            </div>
          </div>

          {/* General Cautions Snapshot */}
          <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-5">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <Info className="h-4 w-4" />
              General Guidance Snapshot
            </h3>
            <ul className="space-y-2">
              {decision_context.generalCautions.map((caution, i) => (
                <li key={i} className="text-xs text-muted-foreground leading-relaxed">
                  • {caution}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex items-start gap-3">
        <Info className="mt-0.5 h-4 w-4 text-blue-600 shrink-0" />
        <div>
           <p className="text-sm font-medium text-blue-900 dark:text-blue-200">Historical Information</p>
           <p className="text-xs text-blue-800/80 dark:text-blue-300/80 mt-1">
             This is a snapshot of the decision context exactly as it was when saved. Product details, premiums, and your profile may have changed since then.
           </p>
        </div>
      </div>
    </div>
  );
}
