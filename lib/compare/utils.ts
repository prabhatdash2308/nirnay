// ─────────────────────────────────────────────────────────────────────────────
// NIRNAY — Compare Utilities
//
// Shared logic for resolving, validating, and manipulating the comparison set.
// URL is the source of truth — the comparison set is derived from ?add= params.
//
// Max products: 3 (per product spec)
// Min useful comparison: 2
// Duplicates: silently deduplicated
// Invalid IDs: silently ignored (not in catalogue → skip)
// ─────────────────────────────────────────────────────────────────────────────

import { getProductById } from "@/lib/catalogue/products";
import type { Product } from "@/lib/types/product";

/** Maximum number of products allowed in a comparison set. */
export const MAX_COMPARE_PRODUCTS = 3;

/**
 * Parse and validate product IDs from URL search params.
 *
 * - Accepts repeated ?add= params (URLSearchParams.getAll)
 * - Deduplicates by ID
 * - Skips IDs not found in the catalogue
 * - Caps at MAX_COMPARE_PRODUCTS
 *
 * Returns an array of valid Product objects in the order they were specified,
 * with duplicates and invalid IDs removed.
 */
export function resolveCompareProducts(addParams: string[]): Product[] {
  const seen = new Set<string>();
  const products: Product[] = [];

  for (const id of addParams) {
    if (!id || seen.has(id)) continue; // skip empty or duplicate
    seen.add(id);

    const product = getProductById(id);
    if (!product) continue; // skip invalid ID — never crash

    products.push(product);

    if (products.length >= MAX_COMPARE_PRODUCTS) break; // enforce cap
  }

  return products;
}

/**
 * Build a /compare URL with the given product IDs.
 * Preserves order and deduplication invariants.
 */
export function buildCompareUrl(productIds: string[]): string {
  const deduped = [...new Set(productIds)].slice(0, MAX_COMPARE_PRODUCTS);
  if (deduped.length === 0) return "/compare";
  const params = deduped.map((id) => `add=${encodeURIComponent(id)}`).join("&");
  return `/compare?${params}`;
}

/**
 * Add a product ID to an existing comparison set.
 * Returns the new ordered, deduplicated, capped ID array.
 */
export function addToCompareSet(
  currentIds: string[],
  newId: string,
): string[] {
  if (currentIds.includes(newId)) return currentIds;
  if (currentIds.length >= MAX_COMPARE_PRODUCTS) return currentIds;
  return [...currentIds, newId];
}

/**
 * Remove a product ID from a comparison set.
 */
export function removeFromCompareSet(
  currentIds: string[],
  removeId: string,
): string[] {
  return currentIds.filter((id) => id !== removeId);
}
