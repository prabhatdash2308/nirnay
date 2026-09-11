"use server";

import { createClient } from "@supabase/supabase-js";
import { getFirebaseAdminAuth } from "../../lib/firebase-admin";
import type { PortfolioData, InsurancePolicy, Investment, FinancialGoal } from "../../../lib/types/portfolio";

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
 * Loads the user's complete portfolio data using RLS and the Firebase auth token.
 */
export async function loadPortfolioData(
  firebaseIdToken: string
): Promise<PortfolioData> {
  // 1. Verify token & get UID implicitly via Supabase RLS (but we verify anyway for safety)
  const adminAuth = getFirebaseAdminAuth();
  const decoded = await adminAuth.verifyIdToken(firebaseIdToken);
  console.log("[load-portfolio] Token verified. UID:", decoded.uid, "role:", decoded.role ?? "(none)");
  console.log("[load-portfolio] Token length:", firebaseIdToken.length);

  const supabase = buildSupabaseWithToken(firebaseIdToken);

  // ─── Sequential queries to isolate which table fails ─────────────────────
  console.log("[load-portfolio] Querying insurance_policies...");
  const policiesRes = await supabase
    .from("insurance_policies")
    .select("*")
    .order("created_at", { ascending: false });

  if (policiesRes.error) {
    console.error("[load-portfolio] insurance_policies FAILED", {
      code: policiesRes.error.code,
      message: policiesRes.error.message,
      details: policiesRes.error.details,
      hint: policiesRes.error.hint,
    });
    throw new Error("Failed to load insurance policies.");
  }
  console.log("[load-portfolio] insurance_policies OK, rows:", policiesRes.data?.length ?? 0);

  console.log("[load-portfolio] Querying investments...");
  const investmentsRes = await supabase
    .from("investments")
    .select("*")
    .order("created_at", { ascending: false });

  if (investmentsRes.error) {
    console.error("[load-portfolio] investments FAILED", {
      code: investmentsRes.error.code,
      message: investmentsRes.error.message,
      details: investmentsRes.error.details,
      hint: investmentsRes.error.hint,
    });
    throw new Error("Failed to load investments.");
  }
  console.log("[load-portfolio] investments OK, rows:", investmentsRes.data?.length ?? 0);

  console.log("[load-portfolio] Querying financial_goals...");
  const goalsRes = await supabase
    .from("financial_goals")
    .select("*")
    .order("created_at", { ascending: false });

  if (goalsRes.error) {
    console.error("[load-portfolio] financial_goals FAILED", {
      code: goalsRes.error.code,
      message: goalsRes.error.message,
      details: goalsRes.error.details,
      hint: goalsRes.error.hint,
    });
    throw new Error("Failed to load financial goals.");
  }
  console.log("[load-portfolio] financial_goals OK, rows:", goalsRes.data?.length ?? 0);

  console.log("[load-portfolio] All queries succeeded. Returning data.");

  return {
    policies: policiesRes.data as InsurancePolicy[],
    investments: investmentsRes.data as Investment[],
    goals: goalsRes.data as FinancialGoal[],
  };
}
