import "server-only";
import { NextResponse } from "next/server";
import { authenticateRequest, isAuthContext } from "@/app/lib/auth-server";
import { supabaseAdmin } from "@/app/lib/supabase-server";
import {
  parseOrError,
  insuranceCompareRequestSchema,
} from "@/app/lib/validation";
import { compareInsuranceProducts } from "@/app/lib/financial-engine";
import type { InsuranceProductForCompare } from "@/app/lib/financial-engine";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if (!isAuthContext(auth)) return auth;

    const body = await request.json().catch(() => ({}));
    const parsed = parseOrError(insuranceCompareRequestSchema, body);
    if (parsed instanceof NextResponse) return parsed;

    const { data: profile } = await supabaseAdmin
      .from("financial_profiles")
      .select("annual_insurance_budget,risk_profile")
      .eq("user_id", auth.userId)
      .maybeSingle();

    const annualBudget =
      parsed.annual_budget ?? profile?.annual_insurance_budget ?? null;

    const { data: products, error } = await supabaseAdmin
      .from("insurance_products")
      .select("*")
      .in("product_key", parsed.product_keys);

    if (error) {
      console.error("insurance-compare fetch error:", error);
      return NextResponse.json(
        { error: "Unable to load products for comparison." },
        { status: 500 },
      );
    }

    if (!products || products.length < 2) {
      return NextResponse.json(
        { error: "At least 2 valid product keys are required." },
        { status: 400 },
      );
    }

    const typed: InsuranceProductForCompare[] = products.map((p) => ({
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

    const result = compareInsuranceProducts(typed, {
      user_age: parsed.user_age ?? null,
      annual_budget: annualBudget ?? null,
      sum_insured_target: parsed.sum_insured_target ?? null,
    });

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("insurance-compare unhandled:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
