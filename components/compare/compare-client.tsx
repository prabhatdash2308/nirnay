"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  X,
  Plus,
  Trash2,
  Compass,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { cn } from "cn";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/app/lib/firebase-client";
import { loadFinancialProfile } from "@/app/(app)/settings/financial-profile/actions";
import { computeSuitability } from "@/lib/suitability/engine";
import { BAND_LABELS, BAND_COLORS, BAND_BG } from "@/lib/suitability/engine";
import {
  buildComparisonSections,
  buildCompareSummary,
} from "@/lib/compare/builder";
import { MAX_COMPARE_PRODUCTS } from "@/lib/compare/utils";
import { useCompareSet } from "@/hooks/use-compare-set";
import type { Product } from "@/lib/types/product";
import type { FinancialProfileInput } from "@/lib/types/financial-profile";
import type { SuitabilityResult } from "@/lib/suitability/engine";

// ─────────────────────────────────────────────────────────────────────────────
// Shared display constants
// ─────────────────────────────────────────────────────────────────────────────

const SUBCATEGORY_LABELS: Record<string, string> = {
  health: "Health Insurance",
  motor: "Motor Insurance",
  term_life: "Term Life Insurance",
  sip: "SIP",
  mutual_fund: "Mutual Fund",
};

const SENTIMENT_CLASSES: Record<string, string> = {
  positive: "text-emerald-700 dark:text-emerald-400",
  caution: "text-amber-700 dark:text-amber-400",
  neutral: "text-foreground",
  info: "text-blue-700 dark:text-blue-400",
};



// ─────────────────────────────────────────────────────────────────────────────
// Empty state — no products selected
// ─────────────────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-dashed border-border py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <ShieldCheck className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-base font-semibold text-foreground">
          Compare products
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
          Choose up to {MAX_COMPARE_PRODUCTS} products from Discover to compare
          their key features, indicative costs, and your profile match
          side-by-side.
        </p>
      </div>
      <Link
        href="/discover"
        id="compare-browse-products"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Compass className="h-4 w-4" />
        Browse products
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// One-product state — prompt to add another
// ─────────────────────────────────────────────────────────────────────────────

function OneProductPrompt({ product }: { product: Product }) {
  const ProductTypeIcon = product.type === "insurance" ? ShieldCheck : TrendingUp;
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card px-4 py-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <ProductTypeIcon className="h-4 w-4 text-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          {product.provider}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-foreground">
          {product.name}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Add another product from Discover to start comparing.
        </p>
        <Link
          href="/discover"
          id="compare-add-another"
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Plus className="h-3.5 w-3.5" />
          Add another product
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Product column header
// ─────────────────────────────────────────────────────────────────────────────

interface ProductHeaderProps {
  product: Product;
  suitability: SuitabilityResult;
  onRemove: () => void;
  colIndex: number;
}

function ProductHeader({
  product,
  suitability,
  onRemove,
  colIndex,
}: ProductHeaderProps) {
  const ProductTypeIcon = product.type === "insurance" ? ShieldCheck : TrendingUp;

  return (
    <div className="flex flex-col gap-3 min-w-[200px]">
      {/* Product identity */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
            <ProductTypeIcon className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <p className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground">
              {product.provider}
            </p>
            <p className="mt-0.5 text-xs font-semibold text-foreground leading-snug">
              {product.name}
            </p>
            <p className="mt-0.5 text-[9px] text-muted-foreground">
              {SUBCATEGORY_LABELS[product.subcategory] ?? product.subcategory}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          id={`compare-remove-${colIndex}`}
          aria-label={`Remove ${product.name} from comparison`}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Suitability pill */}
      {suitability.hasProfile && (
        <div
          className={cn(
            "flex items-center justify-between rounded-lg px-2.5 py-1.5",
            BAND_BG[suitability.band],
          )}
        >
          <span className="text-[9px] text-muted-foreground">Match</span>
          <span className={cn("text-[10px] font-semibold", BAND_COLORS[suitability.band])}>
            {BAND_LABELS[suitability.band]} · {suitability.score}
          </span>
        </div>
      )}
      {!suitability.hasProfile && (
        <div className="rounded-lg bg-muted/40 px-2.5 py-1.5">
          <p className="text-[9px] text-muted-foreground">No profile — match unavailable</p>
        </div>
      )}

      {/* View detail link */}
      <Link
        href={`/discover/${product.id}`}
        id={`compare-view-detail-${colIndex}`}
        className="text-center rounded-md border border-border bg-background py-1 text-[10px] font-medium text-foreground transition-colors hover:bg-muted"
      >
        View details
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Comparison summary panel
// ─────────────────────────────────────────────────────────────────────────────

interface SummaryPanelProps {
  items: ReturnType<typeof buildCompareSummary>;
}

function SummaryPanel({ items }: SummaryPanelProps) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card px-4 py-4 space-y-3">
      <div className="flex items-center gap-2">
        <Info className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Key observations
        </h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] text-muted-foreground font-medium">
          NIRNAY interpretation
        </span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => {
          const Icon =
            item.sentiment === "positive"
              ? CheckCircle2
              : item.sentiment === "caution"
                ? AlertTriangle
                : Info;
          return (
            <div key={i} className="flex items-start gap-2.5">
              <Icon
                className={cn(
                  "mt-0.5 h-3.5 w-3.5 shrink-0",
                  item.sentiment === "positive"
                    ? "text-emerald-500"
                    : item.sentiment === "caution"
                      ? "text-amber-500"
                      : "text-muted-foreground",
                )}
              />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>
      <p className="text-[9px] text-muted-foreground/60 border-t border-border pt-2 leading-relaxed">
        Observations are based solely on catalogue data and your profile heuristics.
        Not financial advice. Verify all details with the product provider.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Comparison table — desktop (scrollable) + mobile (card-style)
// ─────────────────────────────────────────────────────────────────────────────

interface CompareTableProps {
  products: Product[];
  suitabilityMap: Record<string, SuitabilityResult>;
  onRemove: (id: string) => void;
}

function CompareTable({ products, suitabilityMap, onRemove }: CompareTableProps) {
  const sections = useMemo(
    () => buildComparisonSections(products, suitabilityMap),
    [products, suitabilityMap],
  );

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse" aria-label="Product comparison table">
        <thead>
          <tr className="border-b border-border">
            {/* Row label column */}
            <th
              className="w-36 shrink-0 border-r border-border bg-muted/30 px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
              scope="col"
            >
              Attribute
            </th>
            {/* Product columns */}
            {products.map((product, i) => (
              <th
                key={product.id}
                scope="col"
                className="border-r border-border bg-card px-4 py-3 text-left last:border-r-0 align-top"
              >
                <ProductHeader
                  product={product}
                  suitability={suitabilityMap[product.id]}
                  onRemove={() => onRemove(product.id)}
                  colIndex={i}
                />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sections.map((section, sIdx) => (
            <>
              {/* Section header row */}
              <tr key={`section-${sIdx}`} className="bg-muted/20">
                <td
                  colSpan={products.length + 1}
                  className="border-b border-border px-4 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {section.title}
                    </span>
                  </div>
                </td>
              </tr>

              {/* Data rows */}
              {section.rows.map((row, rIdx) => (
                <tr
                  key={`row-${sIdx}-${rIdx}`}
                  className="border-b border-border/50 last:border-b-0 odd:bg-card even:bg-muted/10"
                >
                  {/* Row label */}
                  <td className="border-r border-border px-4 py-3 align-top">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-foreground">
                        {row.label}
                      </span>
                      {row.tooltip && (
                        <span
                          role="tooltip"
                          aria-label={row.tooltip}
                          title={row.tooltip}
                          className="cursor-help"
                        >
                          <HelpCircle className="h-3 w-3 text-muted-foreground/50" />
                        </span>
                      )}
                      {row.kind === "interpretation" && (
                        <span className="rounded bg-muted px-1 py-0.5 text-[8px] font-medium uppercase tracking-wider text-muted-foreground">
                          Est.
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Value cells */}
                  {row.cells.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={cn(
                        "border-r border-border/50 px-4 py-3 align-top text-xs last:border-r-0",
                        cell.notApplicable && "opacity-40",
                      )}
                    >
                      {cell.sentiment && !cell.notApplicable ? (
                        <span
                          className={cn(
                            "inline-block rounded px-1.5 py-0.5",
                            SENTIMENT_CLASSES[cell.sentiment],
                          )}
                        >
                          {cell.value}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">{cell.value}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Compare client — main orchestrator
// ─────────────────────────────────────────────────────────────────────────────

interface CompareClientProps {
  /** Products resolved from URL params (validated, deduplicated) */
  initialProducts: Product[];
}

export function CompareClient({ initialProducts }: CompareClientProps) {
  const router = useRouter();
  const { currentIds, removeProduct, clearAll } = useCompareSet();

  // Products driven by URL state — re-resolve on URL change
  // (initialProducts is the SSR-resolved value; client uses URL directly via hook)
  // We use initialProducts on first render to avoid hydration mismatch
  const [products] = useState(initialProducts);

  // Auth + profile state
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
        // Non-blocking — Compare works without profile
      } finally {
        setLoadingAuth(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Compute suitability for all products
  const suitabilityMap = useMemo<Record<string, SuitabilityResult>>(() => {
    const result: Record<string, SuitabilityResult> = {};
    for (const p of products) {
      result[p.id] = computeSuitability(p, profile);
    }
    return result;
  }, [products, profile]);

  const summarySentiments = useMemo(
    () => buildCompareSummary(products, suitabilityMap),
    [products, suitabilityMap],
  );

  const canAddMore = currentIds.length < MAX_COMPARE_PRODUCTS;

  // ── Render states ─────────────────────────────────────────────────────────

  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-5">
      {/* Compare controls bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Product count pill */}
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {products.length} of {MAX_COMPARE_PRODUCTS} products
          </span>

          {/* Auth loading indicator */}
          {loadingAuth && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Loading profile…
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Decide CTA — shown if at least 1 product selected */}
          {products.length > 0 && (
            <button
              type="button"
              id="compare-help-decide"
              onClick={() => {
                const url = `/decide?${currentIds.map((id) => `add=${encodeURIComponent(id)}`).join("&")}`;
                router.push(url);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Help me decide
            </button>
          )}

          {/* Add another product — only if below max */}
          {canAddMore && (
            <Link
              href="/discover"
              id="compare-add-from-discover"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              Add product
            </Link>
          )}

          {/* Clear all */}
          <button
            type="button"
            id="compare-clear-all"
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear comparison
          </button>
        </div>
      </div>

      {/* Max-products notice */}
      {!canAddMore && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
          <Info className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Maximum of {MAX_COMPARE_PRODUCTS} products reached. Remove a product to add another.
          </p>
        </div>
      )}

      {/* One-product prompt */}
      {products.length === 1 && <OneProductPrompt product={products[0]} />}

      {/* Key observations summary */}
      {products.length >= 2 && <SummaryPanel items={summarySentiments} />}

      {/* Comparison table */}
      {products.length >= 1 && (
        <CompareTable
          products={products}
          suitabilityMap={suitabilityMap}
          onRemove={removeProduct}
        />
      )}

      {/* Reference data disclaimer */}
      <div className="rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">Reference catalogue</span> —
          All product information is reference data for demonstration purposes.
          Financial figures (premiums, SIP minimums, expense ratios, coverage) are
          indicative and may not reflect current pricing. Verify directly with the
          product provider before making any financial decision. NIRNAY does not
          provide financial advice. Profile match scores are heuristic estimates
          only.
        </p>
      </div>
    </div>
  );
}
