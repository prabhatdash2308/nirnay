import "server-only";
import { NextResponse } from "next/server";
import { authenticateRequest, isAuthContext } from "@/app/lib/auth-server";
import { supabaseAdmin } from "@/app/lib/supabase-server";
import {
  parseOrError,
  insuranceRecommendRequestSchema,
} from "@/app/lib/validation";
import { scoreInsuranceProducts } from "@/app/lib/financial-engine";
import type { InsuranceProductForCompare } from "@/app/lib/financial-engine";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if (!isAuthContext(auth)) return auth;

    const body = await request.json().catch(() => ({}));
    const parsed = parseOrError(insuranceRecommendRequestSchema, body);
    if (parsed instanceof NextResponse) return parsed;

    const { data: profile } = await supabaseAdmin
      .from("financial_profiles")
      .select("monthly_income,annual_insurance_budget,risk_profile")
      .eq("user_id", auth.userId)
      .maybeSingle();

    const annualBudget =
      parsed.annual_budget ?? profile?.annual_insurance_budget ?? null;
    const riskPreference =
      parsed.risk_preference ??
      (profile?.risk_profile as
        | "conservative"
        | "moderate"
        | "aggressive"
        | null) ??
      null;
    const annualIncome =
      profile?.monthly_income && profile.monthly_income > 0
        ? (profile.monthly_income as number) * 12
        : undefined;

    const { data: products, error } = await supabaseAdmin
      .from("insurance_products")
      .select("*")
      .eq("product_type", parsed.product_type);

    if (error) {
      console.error("insurance-recommend fetch error:", error);
      return NextResponse.json(
        { error: "Unable to load product catalog." },
        { status: 500 },
      );
    }

    const typed: InsuranceProductForCompare[] = (products ?? []).map((p) => ({
      id: p.id,
      product_key: p.product_key,
      product_type: p.product_type as InsuranceProductForCompare["product_type"],
      provider: p.provider,
      product_name: p.product_name,
      tagline: p.tagline ?? null,
      base_premium: p.base_premium ?? null,
      premium_frequency: p.premium_frequency ?? null,
      sum_insured_min: p.sum_insured_min ?? null,
      sum_insured_max: p.sum_insured_max ?? null,
      sum_insured_default: p.sum_insured_default ?? null,
      features: p.features ?? null,
      coverage_details: p.coverage_details ?? null,
      exclusions: p.exclusions ?? null,
      eligibility_criteria: p.eligibility_criteria ?? null,
      source: p.source ?? null,
      data_classification: p.data_classification ?? null,
    }));

    const result = scoreInsuranceProducts(typed, {
      product_type: parsed.product_type,
      user_age: parsed.user_age ?? null,
      annual_budget: annualBudget ?? null,
      sum_insured_target: parsed.sum_insured_target ?? null,
      risk_preference: riskPreference,
      must_have_features: parsed.must_have_features ?? null,
      annual_income: annualIncome ?? null,
    });

    const limit = parsed.limit ?? 5;
    const limited = {
      ...result,
      results: result.results.slice(0, limit),
    };

    return NextResponse.json({ data: limited });
  } catch (error) {
    console.error("insurance-recommend unhandled:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
