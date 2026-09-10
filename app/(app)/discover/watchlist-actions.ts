"use server";

import { createClient } from "@supabase/supabase-js";
import { getFirebaseAdminAuth } from "@/app/lib/firebase-admin";
import { getProductById, toWatchlistProductType } from "@/lib/catalogue/products";
import type { WatchlistRow } from "@/lib/types/product";

// ─────────────────────────────────────────────────────────────────────────────
// Build an authenticated Supabase client using the user's Firebase JWT.
// Mirrors the pattern established in financial-profile/actions.ts.
// SUPABASE_SECRET_KEY is NOT used — publishable key + Firebase JWT is correct.
// RLS evaluates auth.jwt() ->> 'sub' from the Firebase token.
// ─────────────────────────────────────────────────────────────────────────────

function buildSupabaseWithToken(firebaseIdToken: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    throw new Error("Supabase configuration is missing.");
  }

  return createClient(supabaseUrl, publishableKey, {
    accessToken: async () => firebaseIdToken,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Load all watchlist items for the authenticated user.
// Returns product_id strings in the user's watchlist.
// ─────────────────────────────────────────────────────────────────────────────

export async function loadWatchlistIds(
  firebaseIdToken: string,
): Promise<string[]> {
  const adminAuth = getFirebaseAdminAuth();
  const decoded = await adminAuth.verifyIdToken(firebaseIdToken);
  const uid = decoded.uid;

  const supabase = buildSupabaseWithToken(firebaseIdToken);

  const { data, error } = await supabase
    .from("watchlist")
    .select("product_id")
    .eq("user_id", uid);

  if (error) {
    console.error("[watchlist] Load error:", error.message);
    throw new Error("Unable to load watchlist.");
  }

  return (data as Pick<WatchlistRow, "product_id">[]).map((r) => r.product_id);
}

// ─────────────────────────────────────────────────────────────────────────────
// Add a product to the authenticated user's watchlist.
// Silently succeeds on duplicate (the DB unique constraint prevents doubles).
// ─────────────────────────────────────────────────────────────────────────────

export async function addToWatchlist(
  firebaseIdToken: string,
  productId: string,
): Promise<void> {
  // 1. Verify token and derive uid server-side
  const adminAuth = getFirebaseAdminAuth();
  const decoded = await adminAuth.verifyIdToken(firebaseIdToken);
  const uid = decoded.uid;

  // 2. Validate the product ID exists in the static catalogue
  //    — prevents arbitrary strings reaching the DB
  const product = getProductById(productId);
  if (!product) {
    throw new Error("Invalid product — not found in catalogue.");
  }

  const productType = toWatchlistProductType(product);
  const supabase = buildSupabaseWithToken(firebaseIdToken);

  // 3. Ensure user_profiles row exists (watchlist FK requires it)
  const { error: profileError } = await supabase
    .from("user_profiles")
    .upsert({ user_id: uid }, { onConflict: "user_id" });

  if (profileError) {
    console.error("[watchlist] user_profiles upsert error:", profileError.message);
    throw new Error("Unable to ensure user profile exists.");
  }

  // 4. Insert — DB unique constraint prevents duplicates, so we ignore
  //    the 23505 (unique violation) error code if the item already exists
  const { error } = await supabase.from("watchlist").insert({
    user_id: uid,
    product_id: productId,
    product_type: productType,
  });

  if (error) {
    // PostgreSQL unique violation code — treat as already-saved, not an error
    if (error.code === "23505") return;
    console.error("[watchlist] Insert error:", error.message);
    throw new Error("Unable to save to watchlist. Please try again.");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Remove a product from the authenticated user's watchlist.
// ─────────────────────────────────────────────────────────────────────────────

export async function removeFromWatchlist(
  firebaseIdToken: string,
  productId: string,
): Promise<void> {
  // 1. Verify token server-side — UID never trusted from client
  const adminAuth = getFirebaseAdminAuth();
  const decoded = await adminAuth.verifyIdToken(firebaseIdToken);
  const uid = decoded.uid;

  // 2. Validate product exists (belt-and-suspenders input validation)
  const product = getProductById(productId);
  if (!product) {
    throw new Error("Invalid product — not found in catalogue.");
  }

  const supabase = buildSupabaseWithToken(firebaseIdToken);

  const { error } = await supabase
    .from("watchlist")
    .delete()
    .eq("user_id", uid)
    .eq("product_id", productId);

  if (error) {
    console.error("[watchlist] Delete error:", error.message);
    throw new Error("Unable to remove from watchlist. Please try again.");
  }
}
