import "server-only";
import { NextResponse } from "next/server";
import { authenticateRequest, isAuthContext } from "@/app/lib/auth-server";
import { supabaseAdmin } from "@/app/lib/supabase-server";
import {
  parseOrError,
  insurancePolicyCreateSchema,
  listQuerySchema,
} from "@/app/lib/validation";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if (!isAuthContext(auth)) return auth;

    const { searchParams } = new URL(request.url);
    const qp = Object.fromEntries(searchParams.entries());
    const parsed = parseOrError(listQuerySchema, qp);
    if (parsed instanceof NextResponse) return parsed;

    let query = supabaseAdmin
      .from("insurance_policies")
      .select("*")
      .eq("user_id", auth.userId);

    if (parsed.status) query = query.eq("status", parsed.status);

    const sortBy = parsed.sort_by ?? "renewal_date";
    const sortOrder = parsed.sort_order ?? "asc";
    query = query.order(sortBy, {
      ascending: sortOrder === "asc",
      nullsFirst: false,
    });

    if (parsed.limit) query = query.limit(parsed.limit);
    if (parsed.offset) query = query.range(parsed.offset, parsed.offset + (parsed.limit ?? 100) - 1);

    if (parsed.search) {
      const searchTerm = `%${parsed.search}%`;
      query = query.or(
        `policy_name.ilike.${searchTerm},provider.ilike.${searchTerm},policy_number.ilike.${searchTerm}`,
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("insurance-policies GET error:", error);
      return NextResponse.json(
        { error: "Unable to retrieve insurance policies." },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: data ?? [] });
  } catch (error) {
    console.error("insurance-policies GET unhandled:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if (!isAuthContext(auth)) return auth;

    const body = await request.json().catch(() => ({}));
    const parsed = parseOrError(insurancePolicyCreateSchema, body);
    if (parsed instanceof NextResponse) return parsed;

    const payload = {
      user_id: auth.userId,
      policy_type: parsed.policy_type,
      provider: parsed.provider,
      policy_name: parsed.policy_name,
      policy_number: parsed.policy_number ?? null,
      premium_amount: parsed.premium_amount ?? null,
      premium_frequency: parsed.premium_frequency ?? null,
      sum_insured: parsed.sum_insured ?? null,
      start_date: parsed.start_date ?? null,
      renewal_date: parsed.renewal_date ?? null,
      status: parsed.status ?? "active",
      metadata: parsed.metadata ?? {},
    };

    const { data, error } = await supabaseAdmin
      .from("insurance_policies")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      console.error("insurance-policies POST error:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Policy record conflict detected." },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: "Unable to create insurance policy." },
        { status: 500 },
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("insurance-policies POST unhandled:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
