"use server";

import { createClient } from "@supabase/supabase-js";
import { getFirebaseAdminAuth } from "../../lib/firebase-admin";
import { loadFinancialProfile } from "../settings/financial-profile/actions";
import { getProductById } from "../../../lib/catalogue/products";
import { generateDecisionGuidance } from "../../../lib/decide/logic";
import type { DecisionRecordRow, DecisionContext } from "../../../lib/types/decision";

// Helper to construct authenticated Supabase client
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
 * Saves a decision (intent) securely.
 * Recomputes the authoritative deterministic score and snapshot server-side.
 */
export async function saveDecision(
  firebaseIdToken: string,
  productId: string
): Promise<DecisionRecordRow> {
  // 1. Verify token & get UID
  const adminAuth = getFirebaseAdminAuth();
  const decoded = await adminAuth.verifyIdToken(firebaseIdToken);
  const uid = decoded.uid;

  // 2. Validate product
  const product = getProductById(productId);
  if (!product) {
    throw new Error("Invalid product ID.");
  }

  // 3. Load profile and recompute deterministic context
  const profile = await loadFinancialProfile(firebaseIdToken);
  // generateDecisionGuidance expects an array of products to compare.
  // When saving a specific decision, we evaluate it in isolation.
  const guidance = generateDecisionGuidance([product], profile);
  
  const evaluatedProduct = guidance.strongestMatch || guidance.otherProducts[0];
  if (!evaluatedProduct) {
    throw new Error("Failed to evaluate product.");
  }

  // 4. Construct snapshot
  const decisionContext: DecisionContext = {
    productName: product.name,
    productProvider: product.provider,
    tagline: product.tagline,
    whyItMatches: evaluatedProduct.whyMatches,
    cautions: evaluatedProduct.cautions,
    generalCautions: guidance.generalCautions,
  };

  const suitabilityScore = evaluatedProduct.suitability.hasProfile 
    ? evaluatedProduct.suitability.score 
    : null;

  const payload = {
    user_id: uid,
    product_id: product.id,
    product_type: product.type,
    status: "saved",
    suitability_score: suitabilityScore,
    decision_context: decisionContext,
  };

  // 5. Persist to Supabase
  const supabase = buildSupabaseWithToken(firebaseIdToken);

  // We use upsert with a unique constraint on (user_id, product_id)
  // to avoid duplicating the decision intent.
  const { data, error } = await supabase
    .from("decision_records")
    .upsert(payload, { onConflict: "user_id, product_id" })
    .select()
    .single();

  if (error) {
    console.error("[save-decision] Save error:", error.message);
    throw new Error("Unable to save decision. Please try again.");
  }

  return data as DecisionRecordRow;
}

/**
 * Loads all saved decisions for the authenticated user.
 */
export async function loadSavedDecisions(
  firebaseIdToken: string
): Promise<DecisionRecordRow[]> {
  const adminAuth = getFirebaseAdminAuth();
  await adminAuth.verifyIdToken(firebaseIdToken);

  const supabase = buildSupabaseWithToken(firebaseIdToken);

  const { data, error } = await supabase
    .from("decision_records")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[load-decisions] Load error:", error.message);
    throw new Error("Unable to load saved decisions.");
  }

  return data as DecisionRecordRow[];
}

/**
 * Loads a single historical decision by record ID.
 */
export async function loadDecisionById(
  firebaseIdToken: string,
  id: number
): Promise<DecisionRecordRow | null> {
  const adminAuth = getFirebaseAdminAuth();
  await adminAuth.verifyIdToken(firebaseIdToken);

  const supabase = buildSupabaseWithToken(firebaseIdToken);

  const { data, error } = await supabase
    .from("decision_records")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[load-decision] Load error:", error.message);
    throw new Error("Unable to load decision.");
  }

  return data as DecisionRecordRow | null;
}
