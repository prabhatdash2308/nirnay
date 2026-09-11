"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Bookmark, AlertCircle } from "lucide-react";
import { getProductById } from "@/lib/catalogue/products";
import { computeSuitability } from "@/lib/suitability/engine";
import { ProductCard } from "@/components/discover/product-card";
import { removeFromWatchlist } from "@/app/(app)/discover/watchlist-actions";
import type { FinancialProfileInput } from "@/lib/types/financial-profile";
import type { Product } from "@/lib/types/product";

interface WatchlistClientProps {
  profile: FinancialProfileInput | null;
  initialWatchlistIds: string[];
  isAuthenticated: boolean;
  firebaseIdToken: string | null;
  loadError: string | null;
}

export function WatchlistClient({
  profile,
  initialWatchlistIds,
  isAuthenticated,
  firebaseIdToken,
  loadError,
}: WatchlistClientProps) {
  // Local state for optimistic updates during removal
  const [watchlistIds, setWatchlistIds] = useState<string[]>(initialWatchlistIds);
  const [mutationError, setMutationError] = useState<string | null>(null);

  // 1. Hydrate product IDs into Product objects
  const savedProducts = useMemo(() => {
    return watchlistIds
      .map((id) => getProductById(id))
      .filter((p): p is Product => p !== undefined);
  }, [watchlistIds]);

  // 2. Pre-calculate suitability for all saved products
  const suitabilityMap = useMemo(() => {
    const map: Record<string, ReturnType<typeof computeSuitability>> = {};
    for (const product of savedProducts) {
      map[product.id] = computeSuitability(product, profile);
    }
    return map;
  }, [savedProducts, profile]);

  // 3. Handle toggling (removal) from Watchlist
  async function handleWatchlistToggle(productId: string, add: boolean) {
    if (!isAuthenticated || !firebaseIdToken) return;

    // In Watchlist context, we only expect 'remove' (add = false) interactions
    if (add) return; 

    setMutationError(null);

    // Optimistically hide it
    setWatchlistIds((prev) => prev.filter((id) => id !== productId));

    try {
      await removeFromWatchlist(firebaseIdToken, productId);
    } catch (err) {
      console.error("Failed to remove from watchlist:", err);
      setMutationError("Unable to remove this product. Please try again.");
      // Revert optimistic update
      setWatchlistIds((prev) => {
        if (!prev.includes(productId)) {
          return [...prev, productId];
        }
        return prev;
      });
    }
  }

  // Render Authentication state
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
        <Bookmark className="h-8 w-8 text-muted-foreground/40" />
        <div>
          <p className="text-sm font-medium text-foreground">Sign in required</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Sign in to view your saved products.
          </p>
        </div>
      </div>
    );
  }

  // Render Load Error state
  if (loadError) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center text-destructive">
        <AlertCircle className="h-6 w-6" />
        <p className="text-sm font-medium">{loadError}</p>
      </div>
    );
  }

  // Render Empty State
  if (savedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
        <Bookmark className="h-8 w-8 text-muted-foreground/40" />
        <div>
          <p className="text-sm font-medium text-foreground">No products saved yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Save products from Discover to compare them later and keep interesting options in one place.
          </p>
        </div>
        <Link
          href="/discover"
          className="mt-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Explore Discover
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {savedProducts.length} saved
        </p>
      </div>

      {mutationError && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <p>{mutationError}</p>
        </div>
      )}

      {/* Product grid reused exactly as in Discover */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {savedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            suitability={suitabilityMap[product.id]}
            isWatchlisted={true}
            onWatchlistToggle={handleWatchlistToggle}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>
    </div>
  );
}
