import { supabase } from "@/lib/supabase/client";
import { OnboardingData, IncomeFrequency } from "@/types/onboarding";
import { firebaseAuth } from "@/lib/firebase/client";

function normalizeToMonthly(amount: number | null, frequency: IncomeFrequency | null): number | null {
  if (amount === null || frequency === null) return null;
  switch (frequency) {
    case 'monthly': return amount;
    case 'weekly': return amount * (52 / 12);
    case 'biweekly': return amount * (26 / 12);
    case 'yearly': return amount / 12;
    case 'irregular': return amount; // assumed to be a monthly average
    default: return amount;
  }
}

export async function checkOnboardingStatus(): Promise<boolean> {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Unauthorized");

  // Onboarding complete = authenticated user has a valid financial_profiles row
  const { data: finData, error: finError } = await supabase
    .from("financial_profiles")
    .select("id")
    .eq("user_id", user.uid)
    .maybeSingle();

  if (finError || !finData) {
    return false;
  }

  return true;
}

export async function saveFinancialProfile(data: OnboardingData): Promise<void> {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Your session has expired. Please sign in again.");

  const {
    currency: baseCurrency,
    incomeAmount: baseIncomeAmount,
    incomeFrequency: baseIncomeFrequency,
    fixedCommitments,
  } = data;

  const monthly_income = normalizeToMonthly(baseIncomeAmount, baseIncomeFrequency);
  const monthly_expenses = (fixedCommitments.rent || 0) + (fixedCommitments.utilities || 0) + (fixedCommitments.other || 0);

  // ---------------------------------------------------------------
  // STEP 1 — Upsert financial_profiles
  // ---------------------------------------------------------------
  const { error: finError } = await supabase
    .from("financial_profiles")
    .upsert({
      user_id: user.uid,
      base_currency: baseCurrency,
      base_income_amount: baseIncomeAmount,
      base_income_frequency: baseIncomeFrequency,
      monthly_income,
      monthly_expenses,
    }, { onConflict: "user_id" });

  if (finError) {
    const errorLog = {
      message: finError.message,
      code: finError.code,
      details: finError.details,
      hint: finError.hint,
    };
    console.error("financial_profiles save error properties:", errorLog);
    throw new Error("We couldn't save your financial profile. Please try again.");
  }

  // ---------------------------------------------------------------
  // Onboarding is successfully complete. 
  // No user_profiles update is required.
  // ---------------------------------------------------------------
}

export async function getDashboardData() {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Unauthorized");

  const { data: userProfile, error: userError } = await supabase
    .from("user_profiles")
    .select("full_name")
    .eq("user_id", user.uid)
    .maybeSingle();

  if (userError) throw new Error("Failed to load user profile");

  const { data: finProfile, error: finError } = await supabase
    .from("financial_profiles")
    .select("base_currency, monthly_income, monthly_expenses")
    .eq("user_id", user.uid)
    .single();

  if (finError) throw new Error("Failed to load financial profile");

  const { data: goals, error: goalsError } = await supabase
    .from("financial_goals")
    .select("id, name, target_amount, current_amount, target_date, status")
    .eq("user_id", user.uid)
    .order('created_at', { ascending: true });

  if (goalsError) throw new Error("Failed to load financial goals");

  return {
    fullName: userProfile?.full_name || null,
    financialProfile: {
      baseCurrency: finProfile?.base_currency || "INR",
      monthlyIncome: finProfile?.monthly_income !== null ? Number(finProfile.monthly_income) : null,
      monthlyExpenses: finProfile?.monthly_expenses !== null ? Number(finProfile.monthly_expenses) : null,
    },
    goals: (goals || []).map(g => ({
      id: g.id,
      name: g.name,
      targetAmount: Number(g.target_amount),
      currentAmount: Number(g.current_amount),
      targetDate: g.target_date,
      status: g.status,
    })),
  };
}

export async function getFullFinancialProfile() {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Unauthorized");

  const { data: userProfile, error: userError } = await supabase
    .from("user_profiles")
    .select("full_name, email")
    .eq("user_id", user.uid)
    .maybeSingle();

  if (userError) throw new Error("Failed to load user profile");

  const { data: finProfile, error: finError } = await supabase
    .from("financial_profiles")
    .select("base_currency, base_income_amount, base_income_frequency, monthly_income, monthly_expenses")
    .eq("user_id", user.uid)
    .single();

  if (finError) throw new Error("Failed to load financial profile");

  return {
    fullName: userProfile?.full_name || null,
    email: userProfile?.email || user.email || null,
    baseCurrency: finProfile?.base_currency || "INR",
    baseIncomeAmount: finProfile?.base_income_amount !== null ? Number(finProfile.base_income_amount) : null,
    baseIncomeFrequency: finProfile?.base_income_frequency as IncomeFrequency | null,
    monthlyIncome: finProfile?.monthly_income !== null ? Number(finProfile.monthly_income) : null,
    monthlyExpenses: finProfile?.monthly_expenses !== null ? Number(finProfile.monthly_expenses) : null,
  };
}

export async function updateFinancialProfile(input: import('@/types/financial-profile').UpdateFinancialProfileInput): Promise<void> {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Unauthorized");

  const monthly_income = normalizeToMonthly(input.baseIncomeAmount, input.baseIncomeFrequency);

  // Update user_profiles (name only). 
  // We use upsert so that if the profile doesn't exist yet, it's created.
  // The unique identifier user_id makes this safe without strict constraints if we ignoreDuplicates: false.
  // Actually, since we're avoiding upsert due to PostgREST bugs, let's try a safe approach:
  // we do an update, and if it fails/affects 0 rows, we don't care because this is just an update.
  const { error: userError } = await supabase
    .from("user_profiles")
    .update({
      full_name: input.fullName,
    })
    .eq("user_id", user.uid);

  if (userError) {
    console.error("user_profiles update error", userError);
    throw new Error("Failed to update profile information.");
  }

  // Update financial_profiles
  const { error: finError } = await supabase
    .from("financial_profiles")
    .update({
      base_currency: input.baseCurrency,
      base_income_amount: input.baseIncomeAmount,
      base_income_frequency: input.baseIncomeFrequency,
      monthly_income,
      monthly_expenses: input.monthlyExpenses,
    })
    .eq("user_id", user.uid);

  if (finError) {
    console.error("financial_profiles update error", finError);
    throw new Error("Failed to update financial baseline.");
  }
}
