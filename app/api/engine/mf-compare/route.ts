import "server-only";
import { NextResponse } from "next/server";
import { authenticateRequest, isAuthContext } from "@/app/lib/auth-server";
import { supabaseAdmin } from "@/app/lib/supabase-server";
import {
  parseOrError,
  mutualFundCompareRequestSchema,
} from "@/app/lib/validation";
import { compareMutualFunds } from "@/app/lib/financial-engine";
import type { MutualFundForCompare } from "@/app/lib/financial-engine";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if (!isAuthContext(auth)) return auth;

    const body = await request.json().catch(() => ({}));
    const parsed = parseOrError(mutualFundCompareRequestSchema, body);
    if (parsed instanceof NextResponse) return parsed;

    const { data: profile } = await supabaseAdmin
      .from("financial_profiles")
      .select("monthly_investment_budget,risk_profile")
      .eq("user_id", auth.userId)
      .maybeSingle();

    const { data: funds, error } = await supabaseAdmin
      .from("mutual_funds")
      .select("*")
      .in("product_key", parsed.product_keys);

    if (error) {
      console.error("mf-compare fetch error:", error);
      return NextResponse.json(
        { error: "Unable to load funds for comparison." },
        { status: 500 },
      );
    }

    if (!funds || funds.length < 2) {
      return NextResponse.json(
        { error: "At least 2 valid product keys are required." },
        { status: 400 },
      );
    }

    const typed: MutualFundForCompare[] = funds.map((f) => ({
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

    const result = compareMutualFunds(typed, {
      monthly_investment: profile?.monthly_investment_budget ?? null,
      risk_preference:
        (profile?.risk_profile as
          | "conservative"
          | "moderate"
          | "aggressive"
          | null) ?? null,
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("mf-compare unhandled:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
