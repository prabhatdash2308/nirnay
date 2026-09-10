"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "cn";
import { PRODUCT_CATALOGUE, filterProducts } from "@/lib/catalogue/products";
import { computeSuitability } from "@/lib/suitability/engine";
import { ProductCard } from "@/components/discover/product-card";
import type { ProductCategory, ProductSubcategory } from "@/lib/types/product";
import type { FinancialProfileInput } from "@/lib/types/financial-profile";

// ─────────────────────────────────────────────────────────────────────────────
// Filter configuration
// ─────────────────────────────────────────────────────────────────────────────

interface CategoryTab {
  id: string;
  label: string;
  value: ProductCategory | "all";
}

const CATEGORY_TABS: CategoryTab[] = [
  { id: "cat-all", label: "All", value: "all" },
  { id: "cat-insurance", label: "Insurance", value: "insurance" },
  { id: "cat-investment", label: "Investments", value: "investment" },
];

interface SubcategoryOption {
  id: string;
  label: string;
  value: ProductSubcategory;
  category: ProductCategory;
}

const SUBCATEGORY_OPTIONS: SubcategoryOption[] = [
  { id: "sub-health",      label: "Health",        value: "health",      category: "insurance" },
  { id: "sub-motor",       label: "Motor",          value: "motor",       category: "insurance" },
  { id: "sub-term-life",   label: "Term Life",      value: "term_life",   category: "insurance" },
  { id: "sub-mutual-fund", label: "Mutual Funds",   value: "mutual_fund", category: "investment" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface DiscoverClientProps {
  /** Financial profile loaded server-side (null if not set up) */
  profile: FinancialProfileInput | null;
  /** Product IDs currently in this user's watchlist */
  watchlistIds: string[];
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Discover client component
// ─────────────────────────────────────────────────────────────────────────────

export function DiscoverClient({
  profile,
  watchlistIds: initialWatchlistIds,
  isAuthenticated,
}: DiscoverClientProps) {
  // ── Filter state ─────────────────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<ProductSubcategory | "">("");
  const [searchQuery, setSearchQuery] = useState("");

  // ── Watchlist state ───────────────────────────────────────────────────────
  const [watchlistIds, setWatchlistIds] = useState<string[]>(initialWatchlistIds);

  // ── Available subcategories for current category ──────────────────────────
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === "all") return SUBCATEGORY_OPTIONS;
    return SUBCATEGORY_OPTIONS.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  // Derive effective subcategory — clear it if it's not valid for the current category
  const effectiveSubcategory: ProductSubcategory | "" = useMemo(() => {
    if (!selectedSubcategory) return "";
    const isValid = availableSubcategories.some((s) => s.value === selectedSubcategory);
    return isValid ? selectedSubcategory : "";
  }, [selectedSubcategory, availableSubcategories]);

  // ── Filtered products ─────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return filterProducts({
      category: selectedCategory === "all" ? undefined : selectedCategory,
      subcategory: effectiveSubcategory || undefined,
      searchQuery: searchQuery.trim() || undefined,
    });
  }, [selectedCategory, effectiveSubcategory, searchQuery]);

  // ── Suitability scores ────────────────────────────────────────────────────
  const suitabilityMap = useMemo(() => {
    const result: Record<string, ReturnType<typeof computeSuitability>> = {};
    for (const product of PRODUCT_CATALOGUE) {
      result[product.id] = computeSuitability(product, profile);
    }
    return result;
  }, [profile]);

  // ── Watchlist handlers ────────────────────────────────────────────────────
  function handleWatchlistToggle(productId: string, add: boolean) {
    setWatchlistIds((prev) =>
      add ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  const hasFilters = selectedCategory !== "all" || selectedSubcategory || searchQuery;

  function clearFilters() {
    setSelectedCategory("all");
    setSelectedSubcategory("");
    setSearchQuery("");
  }

  return (
    <div className="space-y-6">
      {/* Profile notice when no profile */}
      {!profile && isAuthenticated && (
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm">
          <SlidersHorizontal className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <span className="font-medium text-foreground">No financial profile set</span>
            <span className="text-muted-foreground">
              {" — "}
              <a
                href="/settings/financial-profile"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Set up your profile
              </a>{" "}
              to see personalised match scores.
            </span>
          </div>
        </div>
      )}

      {/* Unauthenticated notice */}
      {!isAuthenticated && (
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm">
          <SlidersHorizontal className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-muted-foreground">
            <a
              href="/auth"
              className="font-medium text-foreground underline underline-offset-2 hover:text-foreground/80 transition-colors"
            >
              Sign in
            </a>{" "}
            to see personalised match scores and save products to your watchlist.
          </p>
        </div>
      )}

      {/* Category tabs */}
      <div className="flex items-center gap-1" role="tablist" aria-label="Product categories">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.id}
            id={tab.id}
            type="button"
            role="tab"
            aria-selected={selectedCategory === tab.value}
            onClick={() => setSelectedCategory(tab.value)}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
              selectedCategory === tab.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Subcategory + search row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Subcategory chips */}
        <div className="flex flex-wrap gap-1.5">
          {availableSubcategories.map((sub) => (
            <button
              key={sub.id}
              id={sub.id}
              type="button"
              onClick={() =>
                setSelectedSubcategory((prev) =>
                  prev === sub.value ? "" : sub.value
                )
              }
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                selectedSubcategory === sub.value
                  ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/20"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {sub.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-56">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            id="discover-search"
            type="search"
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>
      </div>

      {/* Active filter summary */}
      {hasFilters && (
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">
            Showing {filteredProducts.length} of {PRODUCT_CATALOGUE.length} products
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <X className="h-2.5 w-2.5" />
            Clear filters
          </button>
        </div>
      )}

      {/* Product grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              suitability={suitabilityMap[product.id]}
              isWatchlisted={watchlistIds.includes(product.id)}
              onWatchlistToggle={handleWatchlistToggle}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <Search className="h-8 w-8 text-muted-foreground/40" />
          <div>
            <p className="text-sm font-medium text-foreground">No products found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try adjusting the filters or search query.
            </p>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Catalogue disclaimer */}
      <div className="rounded-lg border border-border/50 bg-muted/20 px-4 py-3">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">Reference catalogue</span> —
          All product information is reference data for demonstration purposes.
          Financial figures (premiums, SIP minimums, expense ratios) are indicative
          and may not reflect current pricing. Verify directly with the product
          provider before making any financial decision. NIRNAY does not provide
          financial advice.
        </p>
      </div>
    </div>
  );
}
