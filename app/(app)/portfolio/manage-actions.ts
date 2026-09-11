
"use server";

import { createClient } from "@supabase/supabase-js";
import { getFirebaseAdminAuth } from "../../lib/firebase-admin";
import type { InsurancePolicy, Investment, FinancialGoal } from "../../../lib/types/portfolio";
import {
  addPolicyInputSchema,
  addInvestmentInputSchema,
  addGoalInputSchema,
  type AddPolicyInput,
  type AddInvestmentInput,
  type AddGoalInput,
} from "../../../lib/portfolio/schemas";


// ─────────────────────────────────────────────────────────────────────────────
// Supabase client factory (reuses same pattern as decide/actions.ts)
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// Input Schemas (server-side Zod validation)
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// (Schemas moved to lib/portfolio/schemas.ts)
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// Insurance Policy CRUD
// ─────────────────────────────────────────────────────────────────────────────

export async function addInsurancePolicy(
  firebaseIdToken: string,
  input: AddPolicyInput
): Promise<InsurancePolicy> {
  const adminAuth = getFirebaseAdminAuth();
  const decoded = await adminAuth.verifyIdToken(firebaseIdToken);
  const uid = decoded.uid;

  const validated = addPolicyInputSchema.parse(input);

  const supabase = buildSupabaseWithToken(firebaseIdToken);
  const payload = {
    user_id: uid,          // ownership derived from verified token only
    ...validated,
    policy_number: validated.policy_number ?? null,
    premium_amount: validated.premium_amount ?? null,
    premium_frequency: validated.premium_frequency ?? null,
    sum_insured: validated.sum_insured ?? null,
    start_date: validated.start_date ?? null,
    renewal_date: validated.renewal_date ?? null,
  };

  const { data, error } = await supabase
    .from("insurance_policies")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("[add-policy] Error:", error.message);
    throw new Error("Failed to save insurance policy.");
  }

  return data as InsurancePolicy;
}

export async function updateInsurancePolicy(
  firebaseIdToken: string,
  policyId: number,
  input: AddPolicyInput
): Promise<InsurancePolicy> {
  const adminAuth = getFirebaseAdminAuth();
  const decoded = await adminAuth.verifyIdToken(firebaseIdToken);
  const uid = decoded.uid;

  const validated = addPolicyInputSchema.parse(input);

  const supabase = buildSupabaseWithToken(firebaseIdToken);
  // RLS enforces user_id match; we also add explicit eq filter as defense-in-depth
  const { data, error } = await supabase
    .from("insurance_policies")
    .update({
      ...validated,
      policy_number: validated.policy_number ?? null,
      premium_amount: validated.premium_amount ?? null,
      premium_frequency: validated.premium_frequency ?? null,
      sum_insured: validated.sum_insured ?? null,
      start_date: validated.start_date ?? null,
      renewal_date: validated.renewal_date ?? null,
    })
    .eq("id", policyId)
    .eq("user_id", uid)
    .select()
    .single();

  if (error) {
    console.error("[update-policy] Error:", error.message);
    throw new Error("Failed to update insurance policy.");
  }

  return data as InsurancePolicy;
}

export async function deleteInsurancePolicy(
  firebaseIdToken: string,
  policyId: number
): Promise<void> {
  const adminAuth = getFirebaseAdminAuth();
  const decoded = await adminAuth.verifyIdToken(firebaseIdToken);
  const uid = decoded.uid;

  const supabase = buildSupabaseWithToken(firebaseIdToken);
  const { error } = await supabase
    .from("insurance_policies")
    .delete()
    .eq("id", policyId)
    .eq("user_id", uid); // defense-in-depth alongside RLS

  if (error) {
    console.error("[delete-policy] Error:", error.message);
    throw new Error("Failed to delete insurance policy.");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Investment CRUD
// ─────────────────────────────────────────────────────────────────────────────

export async function addInvestment(
  firebaseIdToken: string,
  input: AddInvestmentInput
): Promise<Investment> {
  const adminAuth = getFirebaseAdminAuth();
  const decoded = await adminAuth.verifyIdToken(firebaseIdToken);
  const uid = decoded.uid;

  const validated = addInvestmentInputSchema.parse(input);

  const supabase = buildSupabaseWithToken(firebaseIdToken);
  const payload = {
    user_id: uid,
    ...validated,
    provider: validated.provider ?? null,
    amount: validated.amount ?? null,
    frequency: validated.frequency ?? null,
    start_date: validated.start_date ?? null,
  };

  const { data, error } = await supabase
    .from("investments")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("[add-investment] Error:", error.message);
    throw new Error("Failed to save investment.");
  }

  return data as Investment;
}

export async function updateInvestment(
  firebaseIdToken: string,
  investmentId: number,
  input: AddInvestmentInput
): Promise<Investment> {
  const adminAuth = getFirebaseAdminAuth();
  const decoded = await adminAuth.verifyIdToken(firebaseIdToken);
  const uid = decoded.uid;

  const validated = addInvestmentInputSchema.parse(input);

  const supabase = buildSupabaseWithToken(firebaseIdToken);
  const { data, error } = await supabase
    .from("investments")
    .update({
      ...validated,
      provider: validated.provider ?? null,
      amount: validated.amount ?? null,
      frequency: validated.frequency ?? null,
      start_date: validated.start_date ?? null,
    })
    .eq("id", investmentId)
    .eq("user_id", uid)
    .select()
    .single();

  if (error) {
    console.error("[update-investment] Error:", error.message);
    throw new Error("Failed to update investment.");
  }

  return data as Investment;
}

export async function deleteInvestment(
  firebaseIdToken: string,
  investmentId: number
): Promise<void> {
  const adminAuth = getFirebaseAdminAuth();
  const decoded = await adminAuth.verifyIdToken(firebaseIdToken);
  const uid = decoded.uid;

  const supabase = buildSupabaseWithToken(firebaseIdToken);
  const { error } = await supabase
    .from("investments")
    .delete()
    .eq("id", investmentId)
    .eq("user_id", uid);

  if (error) {
    console.error("[delete-investment] Error:", error.message);
    throw new Error("Failed to delete investment.");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Financial Goal CRUD
// ─────────────────────────────────────────────────────────────────────────────

export async function addFinancialGoal(
  firebaseIdToken: string,
  input: AddGoalInput
): Promise<FinancialGoal> {
  const adminAuth = getFirebaseAdminAuth();
  const decoded = await adminAuth.verifyIdToken(firebaseIdToken);
  const uid = decoded.uid;

  const validated = addGoalInputSchema.parse(input);

  const supabase = buildSupabaseWithToken(firebaseIdToken);
  const payload = {
    user_id: uid,
    ...validated,
    target_date: validated.target_date ?? null,
  };

  const { data, error } = await supabase
    .from("financial_goals")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("[add-goal] Error:", error.message);
    throw new Error("Failed to save financial goal.");
  }

  return data as FinancialGoal;
}

export async function updateFinancialGoal(
  firebaseIdToken: string,
  goalId: number,
  input: AddGoalInput
): Promise<FinancialGoal> {
  const adminAuth = getFirebaseAdminAuth();
  const decoded = await adminAuth.verifyIdToken(firebaseIdToken);
  const uid = decoded.uid;

  const validated = addGoalInputSchema.parse(input);

  const supabase = buildSupabaseWithToken(firebaseIdToken);
  const { data, error } = await supabase
    .from("financial_goals")
    .update({
      ...validated,
      target_date: validated.target_date ?? null,
    })
    .eq("id", goalId)
    .eq("user_id", uid)
    .select()
    .single();

  if (error) {
    console.error("[update-goal] Error:", error.message);
    throw new Error("Failed to update financial goal.");
  }

  return data as FinancialGoal;
}

export async function deleteFinancialGoal(
  firebaseIdToken: string,
  goalId: number
): Promise<void> {
  const adminAuth = getFirebaseAdminAuth();
  const decoded = await adminAuth.verifyIdToken(firebaseIdToken);
  const uid = decoded.uid;

  const supabase = buildSupabaseWithToken(firebaseIdToken);
  const { error } = await supabase
    .from("financial_goals")
    .delete()
    .eq("id", goalId)
    .eq("user_id", uid);

  if (error) {
    console.error("[delete-goal] Error:", error.message);
    throw new Error("Failed to delete financial goal.");
  }
}
