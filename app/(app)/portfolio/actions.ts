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
  await adminAuth.verifyIdToken(firebaseIdToken);

  const supabase = buildSupabaseWithToken(firebaseIdToken);

  // Parallel fetch from the 3 tables
  const [policiesRes, investmentsRes, goalsRes] = await Promise.all([
    supabase.from("insurance_policies").select("*").order("created_at", { ascending: false }),
    supabase.from("investments").select("*").order("created_at", { ascending: false }),
    supabase.from("financial_goals").select("*").order("created_at", { ascending: false }),
  ]);

  if (policiesRes.error) {
    console.error("[load-portfolio] Policies error:", policiesRes.error.message);
    throw new Error("Failed to load insurance policies.");
  }
  if (investmentsRes.error) {
    console.error("[load-portfolio] Investments error:", investmentsRes.error.message);
    throw new Error("Failed to load investments.");
  }
  if (goalsRes.error) {
    console.error("[load-portfolio] Goals error:", goalsRes.error.message);
    throw new Error("Failed to load financial goals.");
  }

  return {
    policies: policiesRes.data as InsurancePolicy[],
    investments: investmentsRes.data as Investment[],
    goals: goalsRes.data as FinancialGoal[],
  };
}
