"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { buildCompareUrl, addToCompareSet, removeFromCompareSet } from "@/lib/compare/utils";

/**
 * Hook: manages comparison set state via URL search params.
 *
 * URL is the source of truth — the comparison set is read from ?add= params
 * and mutations push a new URL via router.push().
 *
 * This makes the comparison set shareable/deep-linkable without any global state.
 */
export function useCompareSet() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentIds = searchParams.getAll("add");

  const navigateToSet = useCallback(
    (ids: string[]) => {
      const url = buildCompareUrl(ids);
      router.push(url);
    },
    [router],
  );

  const addProduct = useCallback(
    (productId: string) => {
      const newIds = addToCompareSet(currentIds, productId);
      navigateToSet(newIds);
    },
    [currentIds, navigateToSet],
  );

  const removeProduct = useCallback(
    (productId: string) => {
      const newIds = removeFromCompareSet(currentIds, productId);
      navigateToSet(newIds);
    },
    [currentIds, navigateToSet],
  );

  const clearAll = useCallback(() => {
    router.push("/compare");
  }, [router]);

  const createHref = useCallback(
    (basePath: string) => {
      if (currentIds.length === 0) return basePath;
      const params = currentIds.map((id) => `add=${encodeURIComponent(id)}`).join("&");
      const separator = basePath.includes("?") ? "&" : "?";
      return `${basePath}${separator}${params}`;
    },
    [currentIds]
  );

  return {
    currentIds,
    addProduct,
    removeProduct,
    clearAll,
    createHref,
  };
}
