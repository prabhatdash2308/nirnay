"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  GitCompare,
  Loader2,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/app/lib/firebase-client";
import { loadFinancialProfile } from "@/app/(app)/settings/financial-profile/actions";
import { generateDecisionGuidance } from "@/lib/decide/logic";
import type { EvaluatedProduct } from "@/lib/decide/logic";
import { BAND_LABELS, BAND_COLORS, BAND_BG } from "@/lib/suitability/engine";
import { isInsuranceProduct, isInvestmentProduct } from "@/lib/types/product";
import type { Product } from "@/lib/types/product";
import type { FinancialProfileInput } from "@/lib/types/financial-profile";
import { cn } from "cn";
import { AIExplanationPanel } from "./ai-explanation-panel";
import { saveDecision } from "@/app/(app)/decide/actions";

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponents
// ─────────────────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-dashed border-border py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <GitCompare className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-base font-semibold text-foreground">
          No products selected
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
          Select products from Discover or Compare to receive profile-based
          decision guidance.
        </p>
      </div>
      <Link
        href="/discover"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Compass className="h-4 w-4" />
        Browse products
      </Link>
    </div>
  );
}

function ProductHighlight({ product }: { product: Product }) {
  const isIns = isInsuranceProduct(product);
  const isInv = isInvestmentProduct(product);

  return (
    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-xl border border-border/50 bg-muted/20 p-4">
      {/* Risk */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Risk Level</p>
        <p className="mt-1 text-sm font-medium capitalize text-foreground">{product.riskLevel}</p>
      </div>
      {/* Category */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Type</p>
        <p className="mt-1 text-sm font-medium capitalize text-foreground">
          {product.subcategory.replace("_", " ")}
        </p>
      </div>
      {/* Cost specific */}
      {isIns && (
        <>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Indicative Coverage</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {product.cost.coverageAmount ? `₹${product.cost.coverageAmount.toLocaleString("en-IN")}` : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Indicative Premium</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {product.cost.indicativeAnnualMin ? `from ₹${product.cost.indicativeAnnualMin.toLocaleString("en-IN")}/yr` : "N/A"}
            </p>
          </div>
        </>
      )}
      {isInv && (
        <>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Minimum SIP</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {product.cost.minimumSipAmount ? `₹${product.cost.minimumSipAmount.toLocaleString("en-IN")}/mo` : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Indicative Exp. Ratio</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {product.cost.indicativeExpenseRatioPct ? `~${product.cost.indicativeExpenseRatioPct}%` : "N/A"}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function StrongestMatchCard({
  match,
  hasProfile,
  isTie,
}: {
  match: EvaluatedProduct;
  hasProfile: boolean;
  isTie: boolean;
}) {
  const { product, suitability, whyMatches, cautions } = match;
  const ProductTypeIcon = product.type === "insurance" ? ShieldCheck : TrendingUp;

  return (
    <div className="rounded-2xl border-2 border-primary/20 bg-card overflow-hidden">
      {/* Header Banner */}
      <div className="bg-primary/5 px-6 py-4 flex items-center justify-between border-b border-primary/10">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-semibold text-primary">
            {hasProfile
              ? isTie
                ? "Top matched option (Tied)"
                : "Strongest match for your profile"
              : "Selected product (No profile match)"}
          </h3>
        </div>
        {hasProfile && (
          <div
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1",
              BAND_BG[suitability.band]
            )}
          >
            <span className={cn("text-xs font-semibold", BAND_COLORS[suitability.band])}>
              {BAND_LABELS[suitability.band]}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {suitability.score}/100
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Product Identity */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
            <ProductTypeIcon className="h-6 w-6 text-foreground" />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              {product.provider}
            </p>
            <h4 className="mt-1 text-lg font-bold text-foreground">
              {product.name}
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">{product.tagline}</p>
          </div>
        </div>

        {/* Fact Highlights */}
        <ProductHighlight product={product} />

        {/* Explanations Grid */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Why it matches */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-widest text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              Why this matches
            </h5>
            <ul className="space-y-2">
              {whyMatches.length > 0 ? (
                whyMatches.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/50" />
                    {reason}
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground italic">No specific profile alignments found.</li>
              )}
            </ul>
          </div>

          {/* Cautions */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold uppercase tracking-widest text-foreground flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              What to consider
            </h5>
            <ul className="space-y-2">
              {cautions.length > 0 ? (
                cautions.map((caution, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/50" />
                    {caution}
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground italic">No specific cautions identified.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Action Button */}
        {hasProfile && (
          <SaveDecisionButton productId={product.id} />
        )}
      </div>
    </div>
  );
}

function SaveDecisionButton({ productId }: { productId: string }) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const router = useRouter();

  const handleSave = async () => {
    const user = firebaseAuth.currentUser;
    if (!user) {
      router.push("/auth");
      return;
    }

    setStatus("saving");
    try {
      const token = await user.getIdToken();
      await saveDecision(token, productId);
      setStatus("saved");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  if (status === "saved") {
    return (
      <button disabled className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-600 border border-emerald-500/20">
        <CheckCircle2 className="h-4 w-4" />
        Decision Saved
      </button>
    );
  }

  return (
    <div className="mt-6 flex flex-col items-center gap-2">
      <button
        onClick={handleSave}
        disabled={status === "saving"}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {status === "saving" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving Intent...
          </>
        ) : (
          "Save Decision"
        )}
      </button>
      {status === "error" && (
        <p className="text-xs text-destructive">Failed to save. Please try again.</p>
      )}
    </div>
  );
}

function OtherProductRow({ match }: { match: EvaluatedProduct }) {
  const { product, suitability } = match;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          {product.provider}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-foreground">
          {product.name}
        </p>
      </div>
      <div className="flex items-center gap-4">
        {suitability.hasProfile ? (
          <div className="text-right">
            <p className={cn("text-xs font-semibold", BAND_COLORS[suitability.band])}>
              {BAND_LABELS[suitability.band]}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Score: {suitability.score}/100</p>
          </div>
        ) : (
          <p className="text-[10px] text-muted-foreground">No profile match</p>
        )}
        <Link
          href={`/discover/${product.id}`}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          View details
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Client Component
// ─────────────────────────────────────────────────────────────────────────────

interface DecideClientProps {
  initialProducts: Product[];
}

export function DecideClient({ initialProducts }: DecideClientProps) {
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [profile, setProfile] = useState<FinancialProfileInput | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        setProfile(null);
        setLoadingAuth(false);
        return;
      }
      try {
        const idToken = await user.getIdToken();
        const profileData = await loadFinancialProfile(idToken);
        if (profileData) {
          setProfile({
            monthly_income: profileData.monthly_income,
            monthly_expenses: profileData.monthly_expenses,
            monthly_investment_budget: profileData.monthly_investment_budget,
            annual_insurance_budget: profileData.annual_insurance_budget,
            financial_experience: profileData.financial_experience,
            risk_profile: profileData.risk_profile,
            primary_goals: profileData.primary_goals,
          });
        }
      } catch {
        // Non-blocking
      } finally {
        setLoadingAuth(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const guidance = useMemo(
    () => generateDecisionGuidance(initialProducts, profile),
    [initialProducts, profile]
  );

  if (initialProducts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Top status bar */}
      <div className="flex items-center gap-2">
        {loadingAuth && (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Loading profile context…
          </span>
        )}
      </div>

      {/* Decision Output */}
      {guidance.strongestMatch && (
        <StrongestMatchCard
          match={guidance.strongestMatch}
          hasProfile={guidance.hasProfile}
          isTie={guidance.hasTie}
        />
      )}

      {/* Other Options */}
      {guidance.otherProducts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            Other compared options
          </h3>
          <div className="grid gap-3">
            {guidance.otherProducts.map((match) => (
              <OtherProductRow key={match.product.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {/* AI Explanation Panel */}
      <AIExplanationPanel productIds={initialProducts.map((p) => p.id)} />

      {/* General Cautions */}
      <div className="space-y-3 rounded-xl border border-border bg-card p-5">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
          <Info className="h-4 w-4" />
          Important Limitations
        </h3>
        <ul className="space-y-2">
          {guidance.generalCautions.map((caution, i) => (
            <li key={i} className="text-xs text-muted-foreground leading-relaxed">
              • {caution}
            </li>
          ))}
        </ul>
      </div>

      {/* What this does NOT mean */}
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
        <h3 className="text-sm font-semibold text-destructive flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          What this guidance does NOT mean
        </h3>
        <div className="mt-3 grid gap-2 text-xs text-destructive/80 sm:grid-cols-2">
          <p>• It is NOT a guarantee of performance.</p>
          <p>• It is NOT a live, binding market quote.</p>
          <p>• It is NOT personalized, regulated financial advice.</p>
          <p>• You MUST verify all eligibility and pricing with the provider.</p>
        </div>
      </div>

      {/* Provenance disclaimer */}
      <div className="border-t border-border/50 pt-6">
        <p className="text-[10px] text-muted-foreground leading-relaxed text-center">
          <span className="font-medium text-foreground">Data Provenance:</span>{" "}
          Decision guidance uses structured catalogue attributes and a deterministic heuristic algorithm.
          No AI/LLM hallucinations are used to generate scores or match reasons.
          All product information is reference data.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-3 pt-4">
        <Link
          href={`/compare?${initialProducts.map((p) => `add=${encodeURIComponent(p.id)}`).join("&")}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <GitCompare className="h-4 w-4" />
          Back to Comparison
        </Link>
      </div>
    </div>
  );
}
