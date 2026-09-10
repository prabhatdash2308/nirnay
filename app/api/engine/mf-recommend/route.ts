import "server-only";
import { NextResponse } from "next/server";
import { authenticateRequest, isAuthContext } from "@/app/lib/auth-server";
import { supabaseAdmin } from "@/app/lib/supabase-server";
import {
  parseOrError,
  mutualFundRecommendRequestSchema,
} from "@/app/lib/validation";
import { scoreMutualFunds } from "@/app/lib/financial-engine";
import type { MutualFundForCompare } from "@/app/lib/financial-engine";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if (!isAuthContext(auth)) return auth;

    const body = await request.json().catch(() => ({}));
    const parsed = parseOrError(mutualFundRecommendRequestSchema, body);
    if (parsed instanceof NextResponse) return parsed;

    const { data: profile } = await supabaseAdmin
      .from("financial_profiles")
      .select("monthly_investment_budget,risk_profile")
      .eq("user_id", auth.userId)
      .maybeSingle();

    const monthlyInvestment =
      parsed.monthly_investment ?? profile?.monthly_investment_budget ?? null;
    const riskPreference =
      parsed.risk_preference ??
      (profile?.risk_profile as
        | "conservative"
        | "moderate"
        | "aggressive"
        | null) ??
      null;

    let query = supabaseAdmin.from("mutual_funds").select("*");
    if (parsed.tax_saving_elss) {
      query = query.eq("fund_category", "elss");
    }

    const { data: funds, error } = await query;

    if (error) {
      console.error("mf-recommend fetch error:", error);
      return NextResponse.json(
        { error: "Unable to load mutual fund catalog." },
        { status: 500 },
      );
    }

    const typed: MutualFundForCompare[] = (funds ?? []).map((f) => ({
      id: f.id,
      product_key: f.product_key,
      provider: f.provider,
      scheme_name: f.scheme_name,
      fund_category: f.fund_category,
      sub_category: f.sub_category ?? null,
      risk_level: f.risk_level,
      nav: f.nav ?? null,
      expense_ratio: f.expense_ratio ?? null,
      returns_1y: f.returns_1y ?? null,
      returns_3y: f.returns_3y ?? null,
      returns_5y: f.returns_5y ?? null,
      sip_min_amount: f.sip_min_amount ?? null,
      lumpsum_min_amount: f.lumpsum_min_amount ?? null,
      aum_cr: f.aum_cr ?? null,
      lock_in_period_months: f.lock_in_period_months ?? null,
      exit_load: f.exit_load ?? null,
      features: f.features ?? null,
      source: f.source ?? null,
      data_classification: f.data_classification ?? null,
    }));

    const result = scoreMutualFunds(typed, {
      investment_type: parsed.investment_type ?? "sip",
      monthly_investment: monthlyInvestment ?? null,
      risk_preference: riskPreference,
      investment_horizon_years: parsed.investment_horizon_years ?? null,
      tax_saving_elss: parsed.tax_saving_elss ?? false,
    });

    const limit = parsed.limit ?? 5;
    const limited = {
      ...result,
      results: result.results.slice(0, limit),
    };

    return NextResponse.json({ data: limited });
  } catch (error) {
    console.error("mf-recommend unhandled:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
