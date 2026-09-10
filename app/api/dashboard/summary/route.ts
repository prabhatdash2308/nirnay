import "server-only";
import { NextResponse } from "next/server";
import { authenticateRequest, isAuthContext } from "@/app/lib/auth-server";
import { supabaseAdmin } from "@/app/lib/supabase-server";
import { calculateDashboardSummary } from "@/app/lib/financial-engine";

export const runtime = "nodejs";

const PREMIUM_FREQ_TO_ANNUAL: Record<string, number> = {
  monthly: 12,
  quarterly: 4,
  half_yearly: 2,
  yearly: 1,
  one_time: 1,
};

const INVESTMENT_FREQ_TO_MONTHLY: Record<string, number> = {
  monthly: 1,
  quarterly: 1 / 3,
  yearly: 1 / 12,
  one_time: 0,
};

export async function GET(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if (!isAuthContext(auth)) return auth;

    const profilePromise = supabaseAdmin
      .from("financial_profiles")
      .select(
        "monthly_income,monthly_expenses,monthly_investment_budget,annual_insurance_budget,risk_profile",
      )
      .eq("user_id", auth.userId)
      .maybeSingle();

    const policiesPromise = supabaseAdmin
      .from("insurance_policies")
      .select("id,status,premium_amount,premium_frequency,renewal_date")
      .eq("user_id", auth.userId);

    const investmentsPromise = supabaseAdmin
      .from("investments")
      .select("id,status,amount,frequency")
      .eq("user_id", auth.userId);

    const goalsPromise = supabaseAdmin
      .from("financial_goals")
      .select("id,status")
      .eq("user_id", auth.userId);

    const [profileRes, policiesRes, investmentsRes, goalsRes] =
      await Promise.all([
        profilePromise,
        policiesPromise,
        investmentsPromise,
        goalsPromise,
      ]);

    const profile = profileRes.data ?? null;
    const policies = policiesRes.data ?? [];
    const investments = investmentsRes.data ?? [];
    const goals = goalsRes.data ?? [];

    if (profileRes.error) console.warn("dashboard profile:", profileRes.error);
    if (policiesRes.error) console.warn("dashboard policies:", policiesRes.error);
    if (investmentsRes.error)
      console.warn("dashboard investments:", investmentsRes.error);
    if (goalsRes.error) console.warn("dashboard goals:", goalsRes.error);

    const activePolicies = policies.filter((p) => p.status === "active");
    const activeInvestments = investments.filter((i) => i.status === "active");

    const totalAnnualPremium = activePolicies.reduce((sum, p) => {
      const amt = Number(p.premium_amount) || 0;
      const mult =
        PREMIUM_FREQ_TO_ANNUAL[p.premium_frequency as string] ?? 1;
      return sum + amt * mult;
    }, 0);

    const totalMonthlyInvestment = activeInvestments.reduce((sum, i) => {
      const amt = Number(i.amount) || 0;
      const mult =
        INVESTMENT_FREQ_TO_MONTHLY[i.frequency as string] ?? 0;
      return sum + amt * mult;
    }, 0);

    const now = new Date();
    const cutoff = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 60);
    const upcomingRenewals = activePolicies.filter((p) => {
      if (!p.renewal_date) return false;
      const d = new Date(p.renewal_date);
      return d >= now && d <= cutoff;
    }).length;

    const totalGoals = goals.filter((g) => g.status !== "cancelled").length;

    const summary = calculateDashboardSummary({
      monthlyIncome:
        profile?.monthly_income != null
          ? Number(profile.monthly_income)
          : null,
      monthlyExpenses:
        profile?.monthly_expenses != null
          ? Number(profile.monthly_expenses)
          : null,
      monthlyInvestmentBudget:
        profile?.monthly_investment_budget != null
          ? Number(profile.monthly_investment_budget)
          : null,
      annualInsuranceBudget:
        profile?.annual_insurance_budget != null
          ? Number(profile.annual_insurance_budget)
          : null,
      riskProfile:
        (profile?.risk_profile as
          | "conservative"
          | "moderate"
          | "aggressive"
          | null) ?? null,
      totalActivePolicies: activePolicies.length,
      totalActiveInvestments: activeInvestments.length,
      totalAnnualPremium,
      totalMonthlyInvestment,
      totalGoals,
      upcomingRenewalsCount: upcomingRenewals,
    });

    return NextResponse.json({ data: summary });
  } catch (error) {
    console.error("dashboard-summary unhandled:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
