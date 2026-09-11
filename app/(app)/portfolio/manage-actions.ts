"use server";

import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getFirebaseAdminAuth } from "../../lib/firebase-admin";
import type { InsurancePolicy, Investment, FinancialGoal } from "../../../lib/types/portfolio";

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

export const addPolicyInputSchema = z.object({
  policy_type: z.enum(["health", "motor", "life", "other"]),
  provider: z.string().min(1, "Provider is required").max(200),
  policy_name: z.string().min(1, "Policy name is required").max(200),
  policy_number: z.string().max(100).optional(),
  premium_amount: z.number().nonnegative("Premium must be non-negative").optional(),
  premium_frequency: z.enum(["monthly", "quarterly", "half_yearly", "yearly", "one_time"]).optional(),
  sum_insured: z.number().nonnegative("Sum insured must be non-negative").optional(),
  start_date: z.string().optional(),   // ISO date string "YYYY-MM-DD"
  renewal_date: z.string().optional(), // ISO date string "YYYY-MM-DD"
  status: z.enum(["active", "expired", "cancelled", "pending"]).default("active"),
});
export type AddPolicyInput = z.infer<typeof addPolicyInputSchema>;

export const addInvestmentInputSchema = z.object({
  investment_type: z.enum(["mutual_fund", "sip", "stock", "etf", "fd", "nps", "other"]),
  provider: z.string().max(200).optional(),
  scheme_name: z.string().min(1, "Name is required").max(200),
  amount: z.number().nonnegative("Amount must be non-negative").optional(),
  frequency: z.enum(["monthly", "quarterly", "yearly", "one_time"]).optional(),
  start_date: z.string().optional(), // ISO date string "YYYY-MM-DD"
  status: z.enum(["active", "paused", "completed", "cancelled"]).default("active"),
});
export type AddInvestmentInput = z.infer<typeof addInvestmentInputSchema>;

export const addGoalInputSchema = z.object({
  name: z.string().min(1, "Goal name is required").max(200),
  goal_type: z.enum(["emergency_fund", "retirement", "house", "car", "education", "travel", "custom"]),
  target_amount: z.number().positive("Target amount must be greater than 0"),
  current_amount: z.number().nonnegative("Current amount must be non-negative"),
  target_date: z.string().optional(), // ISO date string "YYYY-MM-DD"
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z.enum(["active", "completed", "paused", "cancelled"]).default("active"),
});
export type AddGoalInput = z.infer<typeof addGoalInputSchema>;

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
