import "server-only";
import { NextResponse } from "next/server";
import { authenticateRequest, isAuthContext } from "@/app/lib/auth-server";
import { supabaseAdmin } from "@/app/lib/supabase-server";
import {
  parseOrError,
  financialProfileUpsertSchema,
} from "@/app/lib/validation";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if (!isAuthContext(auth)) return auth;

    const { data, error } = await supabaseAdmin
      .from("financial_profiles")
      .select("*")
      .eq("user_id", auth.userId)
      .maybeSingle();

    if (error) {
      console.error("financial-profiles GET error:", error);
      return NextResponse.json(
        { error: "Unable to retrieve financial profile." },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: data ?? null });
  } catch (error) {
    console.error("financial-profiles GET unhandled:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if (!isAuthContext(auth)) return auth;

    const body = await request.json().catch(() => ({}));
    const parsed = parseOrError(financialProfileUpsertSchema, body);
    if (parsed instanceof NextResponse) return parsed;

    const payload = {
      user_id: auth.userId,
      monthly_income: parsed.monthly_income ?? null,
      monthly_expenses: parsed.monthly_expenses ?? null,
      monthly_investment_budget: parsed.monthly_investment_budget ?? null,
      annual_insurance_budget: parsed.annual_insurance_budget ?? null,
      risk_profile: parsed.risk_profile ?? null,
      financial_experience: parsed.financial_experience ?? null,
      primary_goals: parsed.primary_goals ?? [],
    };

    const { data, error } = await supabaseAdmin
      .from("financial_profiles")
      .upsert(payload, { onConflict: "user_id" })
      .select("*")
      .single();

    if (error) {
      console.error("financial-profiles PUT error:", error);
      return NextResponse.json(
        { error: "Unable to save financial profile." },
        { status: 500 },
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("financial-profiles PUT unhandled:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
