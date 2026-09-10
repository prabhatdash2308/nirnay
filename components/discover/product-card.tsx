"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Bookmark,
  BookmarkCheck,
  GitCompare,
  ShieldCheck,
  TrendingUp,
  Info,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "cn";
import type { Product } from "@/lib/types/product";
import { isInsuranceProduct, isInvestmentProduct } from "@/lib/types/product";
import type { SuitabilityResult } from "@/lib/suitability/engine";
import { BAND_LABELS, BAND_COLORS, BAND_BG } from "@/lib/suitability/engine";
import { addToWatchlist, removeFromWatchlist } from "@/app/(app)/discover/watchlist-actions";
import { firebaseAuth } from "@/app/lib/firebase-client";

// ─────────────────────────────────────────────────────────────────────────────
// Icon map for product features
// ─────────────────────────────────────────────────────────────────────────────

const FEATURE_ICONS = {
  shield: ShieldCheck,
  trend: TrendingUp,
  clock: Clock,
  check: CheckCircle2,
  info: Info,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Subcategory label map
// ─────────────────────────────────────────────────────────────────────────────

const SUBCATEGORY_LABELS: Record<string, string> = {
  health:      "Health Insurance",
  motor:       "Motor Insurance",
  term_life:   "Term Life Insurance",
  sip:         "SIP",
  mutual_fund: "Mutual Fund",
};

// ─────────────────────────────────────────────────────────────────────────────
// Product Card
// ─────────────────────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product;
  suitability: SuitabilityResult;
  isWatchlisted: boolean;
  onWatchlistToggle: (productId: string, add: boolean) => void;
  isAuthenticated: boolean;
}

export function ProductCard({
  product,
  suitability,
  isWatchlisted,
  onWatchlistToggle,
  isAuthenticated,
}: ProductCardProps) {
  const [saving, startSaving] = useTransition();
  const [localWatchlisted, setLocalWatchlisted] = useState(isWatchlisted);
  const [watchlistError, setWatchlistError] = useState<string | null>(null);

  async function handleWatchlistToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setWatchlistError("Sign in to save to watchlist");
      return;
    }

    setWatchlistError(null);
    const adding = !localWatchlisted;
    setLocalWatchlisted(adding); // optimistic update

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

        onWatchlistToggle(product.id, adding);
      } catch {
        setLocalWatchlisted(!adding); // revert on failure
        setWatchlistError("Unable to update watchlist");
      }
    });
  }

  const productTypeIcon = isInsuranceProduct(product) ? ShieldCheck : TrendingUp;
  const ProductTypeIcon = productTypeIcon;

  // First 3 key features for the card
  const cardFeatures = product.keyFeatures.slice(0, 3);

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card transition-shadow hover:shadow-sm">
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3.5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
            <ProductTypeIcon className="h-4 w-4 text-foreground" />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              {product.provider}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-foreground leading-snug">
              {product.name}
            </p>
          </div>
        </div>

        {/* Watchlist button */}
        <button
          type="button"
          onClick={handleWatchlistToggle}
          disabled={saving}
          aria-label={localWatchlisted ? "Remove from watchlist" : "Save to watchlist"}
          className={cn(
            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
            localWatchlisted
              ? "text-primary hover:text-primary/70"
              : "text-muted-foreground hover:text-foreground",
            saving && "opacity-50"
          )}
        >
          {localWatchlisted ? (
            <BookmarkCheck className="h-4 w-4" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Subcategory badge */}
      <div className="flex items-center gap-2 px-4 pt-3">
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          {SUBCATEGORY_LABELS[product.subcategory] ?? product.subcategory}
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground capitalize">
          {product.riskLevel} risk
        </span>
      </div>

      {/* Tagline */}
      <p className="px-4 pt-2 text-xs text-muted-foreground leading-relaxed">
        {product.tagline}
      </p>

      {/* Key features */}
      <div className="flex-1 space-y-1.5 px-4 pt-3">
        {cardFeatures.map((feature, i) => {
          const FeatureIcon = FEATURE_ICONS[feature.icon ?? "check"];
          return (
            <div key={i} className="flex items-center gap-2">
              <FeatureIcon className="h-3 w-3 shrink-0 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{feature.label}</span>
            </div>
          );
        })}
      </div>

      {/* Cost indicator */}
      <div className="px-4 pt-3">
        {isInsuranceProduct(product) && product.cost.indicativeAnnualMin && (
          <p className="text-[10px] text-muted-foreground/70">
            <span className="font-medium text-muted-foreground">
              From ₹{product.cost.indicativeAnnualMin.toLocaleString("en-IN")}/yr
            </span>{" "}
            · indicative
          </p>
        )}
        {isInvestmentProduct(product) && product.cost.minimumSipAmount && (
          <p className="text-[10px] text-muted-foreground/70">
            <span className="font-medium text-muted-foreground">
              SIP from ₹{product.cost.minimumSipAmount.toLocaleString("en-IN")}/mo
            </span>{" "}
            · indicative
          </p>
        )}
      </div>

      {/* Suitability indicator */}
      {suitability.hasProfile && (
        <div
          className={cn(
            "mx-4 mt-3 flex items-center justify-between rounded-lg px-3 py-2",
            BAND_BG[suitability.band]
          )}
        >
          <span className="text-[10px] font-medium text-muted-foreground">
            Profile match
          </span>
          <span className={cn("text-xs font-semibold", BAND_COLORS[suitability.band])}>
            {BAND_LABELS[suitability.band]} · {suitability.score}
          </span>
        </div>
      )}

      {!suitability.hasProfile && (
        <div className="mx-4 mt-3 rounded-lg bg-muted/40 px-3 py-2">
          <p className="text-[10px] text-muted-foreground">
            Set up your financial profile for a personalised match score
          </p>
        </div>
      )}

      {/* Watchlist error */}
      {watchlistError && (
        <p className="px-4 pt-1 text-[10px] text-destructive">{watchlistError}</p>
      )}

      {/* Card footer */}
      <div className="mt-3 flex items-center gap-2 border-t border-border px-4 py-3">
        <Link
          href={`/discover/${product.id}`}
          id={`product-card-detail-${product.id}`}
          className="flex-1 rounded-md border border-border bg-background py-1.5 text-center text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          View details
        </Link>
        <Link
          href={`/compare?add=${product.id}`}
          id={`product-card-compare-${product.id}`}
          aria-label="Add to compare"
          className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <GitCompare className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Provenance footer */}
      <div className="border-t border-border/50 px-4 py-2">
        <p className="text-[9px] text-muted-foreground/60">
          Reference data · {product.provenance.source.name} ·{" "}
          {product.provenance.lastUpdated}
        </p>
      </div>
    </div>
  );
}
