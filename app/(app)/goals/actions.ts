"use server";

import { createClient } from "@supabase/supabase-js";
import { getFirebaseAdminAuth } from "../../lib/firebase-admin";
import type { FinancialGoal } from "../../../lib/types/portfolio";

function buildSupabaseWithToken(firebaseIdToken: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Supabase configuration is missing.");
  }

  return createClient(supabaseUrl, supabasePublishableKey, {
    global: {
      headers: {
        Authorization: `Bearer ${firebaseIdToken}`,
      },
    },
    accessToken: async () => firebaseIdToken,
  });
}

/**
 * Loads the user's financial goals using RLS and the Firebase auth token.
 */
export async function loadGoalsData(
  firebaseIdToken: string
): Promise<FinancialGoal[]> {
  // 1. Verify token via Firebase Admin
  const adminAuth = getFirebaseAdminAuth();
  const decoded = await adminAuth.verifyIdToken(firebaseIdToken);
  console.log("[load-goals] Token verified. UID:", decoded.uid);

  // 2. Build Supabase client injecting the verified token for RLS
  const supabase = buildSupabaseWithToken(firebaseIdToken);

  console.log("[load-goals] Querying financial_goals...");
  const goalsRes = await supabase
    .from("financial_goals")
    .select("*")
    .order("created_at", { ascending: false });

  if (goalsRes.error) {
    console.error("[load-goals] financial_goals FAILED", {
      code: goalsRes.error.code,
      message: goalsRes.error.message,
      details: goalsRes.error.details,
      hint: goalsRes.error.hint,
    });
    throw new Error("Failed to load financial goals.");
  }
  console.log("[load-goals] financial_goals OK, rows:", goalsRes.data?.length ?? 0);

  return goalsRes.data as FinancialGoal[];
}
