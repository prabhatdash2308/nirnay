"use server";

import { createClient } from "@supabase/supabase-js";
import { getFirebaseAdminAuth } from "@/app/lib/firebase-admin";
import {
  financialProfileSchema,
  type FinancialProfileInput,
  type FinancialProfileRow,
} from "@/lib/types/financial-profile";

// ─────────────────────────────────────────────────────────────
// Build a Supabase client authenticated with the user's
// Firebase ID token retrieved from a request header.
//
// Server Actions run on the server. The Firebase ID token is
// sent by the client form as a custom header before calling
// the action — or we pass it explicitly as a parameter.
//
// We use the SUPABASE_SECRET_KEY (service role) ONLY to issue
// an authenticated client on behalf of a verified Firebase user.
// RLS still applies because we pass the user's JWT via the
// Authorization header of the Supabase request.
//
// IMPORTANT: SUPABASE_SECRET_KEY never reaches the browser.
// ─────────────────────────────────────────────────────────────

function buildSupabaseWithToken(firebaseIdToken: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Supabase configuration is missing.");
  }

  // Use the publishable key (anon) + pass the Firebase token as accessToken
  // so that Supabase validates it through the configured third-party auth.
  // This mirrors the browser client architecture — RLS applies fully.
  return createClient(supabaseUrl, supabasePublishableKey, {
    accessToken: async () => firebaseIdToken,
  });
}

// ─────────────────────────────────────────────────────────────
// Load the financial profile for the authenticated user.
// Returns null if no profile exists yet.
// ─────────────────────────────────────────────────────────────

export async function loadFinancialProfile(
  firebaseIdToken: string,
): Promise<FinancialProfileRow | null> {
  const adminAuth = getFirebaseAdminAuth();
  const decoded = await adminAuth.verifyIdToken(firebaseIdToken);
  const uid = decoded.uid;

  const supabase = buildSupabaseWithToken(firebaseIdToken);

  const { data, error } = await supabase
    .from("financial_profiles")
    .select("*")
    .eq("user_id", uid)
    .maybeSingle();

  if (error) {
    console.error("[financial-profile] Load error:", error.message);
    throw new Error("Unable to load financial profile.");
  }

  return data as FinancialProfileRow | null;
}

// ─────────────────────────────────────────────────────────────
// Save (upsert) the financial profile.
// Returns the saved row on success, throws on failure.
// ─────────────────────────────────────────────────────────────

export async function saveFinancialProfile(
  firebaseIdToken: string,
  input: FinancialProfileInput,
): Promise<FinancialProfileRow> {
  // 1. Verify the Firebase token server-side — derive UID from token,
  //    never from the client payload.
  const adminAuth = getFirebaseAdminAuth();
  const decoded = await adminAuth.verifyIdToken(firebaseIdToken);
  const uid = decoded.uid;

  // 2. Validate all fields against the schema.
  const parsed = financialProfileSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input.";
    throw new Error(firstError);
  }

  const supabase = buildSupabaseWithToken(firebaseIdToken);

  // 3. Ensure user_profiles row exists (financial_profiles FK requires it).
  //    The auth test page already does this on sign-in, but we guard here
  //    too for robustness.
  const { error: profileEnsureError } = await supabase
    .from("user_profiles")
    .upsert({ user_id: uid }, { onConflict: "user_id" });

  if (profileEnsureError) {
    console.error("[financial-profile] user_profiles upsert error:", profileEnsureError.message);
    throw new Error("Unable to ensure user profile exists.");
  }

  // 4. Upsert the financial profile. user_id is unique, so conflicts update.
  const payload = {
    user_id: uid,
    ...parsed.data,
  };

  const { data, error } = await supabase
    .from("financial_profiles")
    .upsert(payload, { onConflict: "user_id" })
    .select()
    .single();

  if (error) {
    console.error("[financial-profile] Save error:", error.message);
    throw new Error("Unable to save financial profile. Please try again.");
  }

  return data as FinancialProfileRow;
}
