"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  GitCompare,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  Clock,
  Info,
  AlertTriangle,
  Database,
  Loader2,
} from "lucide-react";
import { cn } from "cn";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/app/lib/firebase-client";
import { loadFinancialProfile } from "@/app/(app)/settings/financial-profile/actions";
import { loadWatchlistIds, addToWatchlist, removeFromWatchlist } from "@/app/(app)/discover/watchlist-actions";
import { computeSuitability, BAND_LABELS, BAND_COLORS, BAND_BG } from "@/lib/suitability/engine";
import { isInsuranceProduct, isInvestmentProduct } from "@/lib/types/product";
import type { Product } from "@/lib/types/product";
import type { FinancialProfileInput } from "@/lib/types/financial-profile";

// ─────────────────────────────────────────────────────────────────────────────
// Feature icon map
// ─────────────────────────────────────────────────────────────────────────────

const FEATURE_ICONS = {
  shield: ShieldCheck,
  trend: TrendingUp,
  clock: Clock,
  check: CheckCircle2,
  info: Info,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Subcategory labels
// ─────────────────────────────────────────────────────────────────────────────

const SUBCATEGORY_LABELS: Record<string, string> = {
  health:      "Health Insurance",
  motor:       "Motor Insurance",
  term_life:   "Term Life Insurance",
  sip:         "SIP",
  mutual_fund: "Mutual Fund",
};

// ─────────────────────────────────────────────────────────────────────────────
// Verification status display
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_LABELS = {
  reference:   "Reference / Demo data",
  provider:    "Provider documentation",
  regulatory:  "Regulatory source",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Product Detail Client Component
// ─────────────────────────────────────────────────────────────────────────────

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<FinancialProfileInput | null>(null);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [saving, startSaving] = useTransition();
  const [watchlistError, setWatchlistError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        setIsAuthenticated(false);
        setProfile(null);
        setLoadingAuth(false);
        return;
      }

      setIsAuthenticated(true);

      try {
        const idToken = await user.getIdToken();
        const [profileData, wlIds] = await Promise.allSettled([
          loadFinancialProfile(idToken),
          loadWatchlistIds(idToken),
        ]);

        if (profileData.status === "fulfilled" && profileData.value) {
          const row = profileData.value;
          setProfile({
            monthly_income: row.monthly_income,
            monthly_expenses: row.monthly_expenses,
            monthly_investment_budget: row.monthly_investment_budget,
            annual_insurance_budget: row.annual_insurance_budget,
            financial_experience: row.financial_experience,
            risk_profile: row.risk_profile,
            primary_goals: row.primary_goals,
          });
        }

        if (wlIds.status === "fulfilled") {
          setIsWatchlisted(wlIds.value.includes(product.id));
        }
      } catch {
        // Non-blocking
      } finally {
        setLoadingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [product.id]);

  // Suitability (computed client-side after profile loads)
  const suitability = computeSuitability(product, profile);

  async function handleWatchlistToggle() {
    if (!isAuthenticated) {
      setWatchlistError("Sign in to save to your watchlist.");
      return;
    }

    setWatchlistError(null);
    const adding = !isWatchlisted;
    setIsWatchlisted(adding); // optimistic

    startSaving(async () => {
      try {
        const user = firebaseAuth.currentUser;
        if (!user) throw new Error("Not signed in");
        const idToken = await user.getIdToken();
        if (adding) {
          await addToWatchlist(idToken, product.id);
        } else {
          await removeFromWatchlist(idToken, product.id);
        }
      } catch {
        setIsWatchlisted(!adding); // revert
        setWatchlistError("Unable to update watchlist. Please try again.");
      }
    });
  }

  const ProductTypeIcon = isInsuranceProduct(product) ? ShieldCheck : TrendingUp;

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6 lg:p-8">
      {/* Back link */}
      <Link
        href="/discover"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Discover
      </Link>

      {/* Product header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
            <ProductTypeIcon className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {product.provider}
            </p>
            <h2 className="mt-0.5 text-xl font-semibold text-foreground">
              {product.name}
            </h2>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {SUBCATEGORY_LABELS[product.subcategory] ?? product.subcategory}
              </span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground capitalize">
                {product.riskLevel} risk
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            id={`detail-watchlist-${product.id}`}
            type="button"
            onClick={handleWatchlistToggle}
            disabled={saving}
            aria-label={isWatchlisted ? "Remove from watchlist" : "Save to watchlist"}
            className={cn(
              "flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
              isWatchlisted ? "text-primary border-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-muted",
              saving && "opacity-50"
            )}
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : isWatchlisted ? (
              <BookmarkCheck className="h-3.5 w-3.5" />
            ) : (
              <Bookmark className="h-3.5 w-3.5" />
            )}
            {isWatchlisted ? "Saved" : "Save"}
          </button>

          <Link
            id={`detail-compare-${product.id}`}
            href={`/compare?add=${product.id}`}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <GitCompare className="h-3.5 w-3.5" />
            Compare
          </Link>
        </div>
      </div>

      {watchlistError && (
        <p className="text-xs text-destructive">{watchlistError}</p>
      )}

      {/* Tagline / description */}
      <div className="rounded-xl border border-border bg-card px-4 py-4">
        <p className="text-sm font-medium text-foreground">{product.tagline}</p>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {product.description}
        </p>
        {isInvestmentProduct(product) && (
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
            <span className="font-medium text-foreground">Objective: </span>
            {product.investmentObjective}
          </p>
        )}
      </div>

      {/* Key features */}
      <section aria-labelledby="features-heading">
        <h3
          id="features-heading"
          className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Key features
        </h3>
        <div className="space-y-2">
          {product.keyFeatures.map((feature, i) => {
            const FeatureIcon = FEATURE_ICONS[feature.icon ?? "check"];
            return (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-border bg-card px-3 py-2.5"
              >
                <FeatureIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-sm text-foreground">{feature.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cost information */}
      <section aria-labelledby="cost-heading">
        <h3
          id="cost-heading"
          className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          {isInsuranceProduct(product) ? "Cost — indicative" : "Costs — indicative"}
        </h3>
        <div className="rounded-xl border border-border bg-card px-4 py-4 space-y-3">
          {isInsuranceProduct(product) && (
            <>
              {product.cost.coverageAmount && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Coverage amount</span>
                  <span className="text-sm font-medium text-foreground">
                    ₹{product.cost.coverageAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
              {product.cost.indicativeAnnualMin && product.cost.indicativeAnnualMax && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Annual premium range</span>
                  <span className="text-sm font-medium text-foreground">
                    ₹{product.cost.indicativeAnnualMin.toLocaleString("en-IN")} –{" "}
                    ₹{product.cost.indicativeAnnualMax.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
              {product.cost.pricingNote && (
                <p className="text-[10px] text-muted-foreground border-t border-border pt-2">
                  {product.cost.pricingNote}
                </p>
              )}
            </>
          )}
          {isInvestmentProduct(product) && (
            <>
              {product.cost.minimumSipAmount && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Minimum SIP</span>
                  <span className="text-sm font-medium text-foreground">
                    ₹{product.cost.minimumSipAmount.toLocaleString("en-IN")}/month
                  </span>
                </div>
              )}
              {product.cost.indicativeExpenseRatioPct && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Expense ratio (indicative)</span>
                  <span className="text-sm font-medium text-foreground">
                    ~{product.cost.indicativeExpenseRatioPct}%
                  </span>
                </div>
              )}
              {product.cost.costNote && (
                <p className="text-[10px] text-muted-foreground border-t border-border pt-2">
                  {product.cost.costNote}
                </p>
              )}
            </>
          )}
          <div className="flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-950/30 px-3 py-2 border-t border-border">
            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-[10px] text-amber-700 dark:text-amber-300">
              All figures are indicative reference values. Verify actual costs
              directly with {product.provider} before making any decision.
            </p>
          </div>
        </div>
      </section>

      {/* Eligibility (insurance only) */}
      {isInsuranceProduct(product) && (
        <section aria-labelledby="eligibility-heading">
          <h3
            id="eligibility-heading"
            className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
          >
            Eligibility
          </h3>
          <div className="rounded-xl border border-border bg-card px-4 py-3.5">
            <p className="text-sm text-muted-foreground">{product.eligibility}</p>
          </div>
        </section>
      )}

      {/* Important considerations */}
      <section aria-labelledby="considerations-heading">
        <h3
          id="considerations-heading"
          className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Important considerations
        </h3>
        <div className="space-y-1.5">
          {product.importantConsiderations.map((consideration, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-border bg-card px-3 py-2.5"
            >
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {consideration}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Suitability */}
      <section aria-labelledby="suitability-heading">
        <h3
          id="suitability-heading"
          className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Profile match
        </h3>

        {loadingAuth ? (
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading your profile…</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card px-4 py-4 space-y-4">
            {/* Score + band */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Heuristic match score</p>
                <p className={cn("mt-0.5 text-2xl font-semibold tabular-nums", BAND_COLORS[suitability.band])}>
                  {suitability.hasProfile ? suitability.score : "—"}
                  {suitability.hasProfile && <span className="text-sm font-normal text-muted-foreground"> / 100</span>}
                </p>
              </div>
              {suitability.hasProfile && (
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold",
                    BAND_BG[suitability.band],
                    BAND_COLORS[suitability.band]
                  )}
                >
                  {BAND_LABELS[suitability.band]}
                </span>
              )}
            </div>

            {/* Reasons */}
            <div className="space-y-1.5 border-t border-border pt-3">
              {suitability.reasons.map((reason, i) => (
                <div key={i} className="flex items-start gap-2">
                  {reason.sentiment === "positive" ? (
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  ) : reason.sentiment === "caution" ? (
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  ) : (
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  )}
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {reason.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-muted-foreground border-t border-border pt-3 leading-relaxed">
              {suitability.disclaimer}
            </p>

            {/* CTA if no profile */}
            {!suitability.hasProfile && (
              <Link
                href="/settings/financial-profile"
                className="inline-flex items-center gap-1 text-xs font-medium text-foreground underline underline-offset-2 hover:text-foreground/80 transition-colors"
              >
                Set up your profile to get a match score →
              </Link>
            )}
          </div>
        )}
      </section>

      {/* Provenance / Trust */}
      <section aria-labelledby="provenance-heading">
        <h3
          id="provenance-heading"
          className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Data source
        </h3>
        <div className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-4">
          <Database className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {STATUS_LABELS[product.provenance.status]}
            </p>
            <p className="text-xs text-muted-foreground">
              {product.provenance.source.name}
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated: {product.provenance.lastUpdated}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
