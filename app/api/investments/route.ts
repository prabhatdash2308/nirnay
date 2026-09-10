import "server-only";
import { NextResponse } from "next/server";
import { authenticateRequest, isAuthContext } from "@/app/lib/auth-server";
import { supabaseAdmin } from "@/app/lib/supabase-server";
import {
  parseOrError,
  investmentCreateSchema,
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
      .from("investments")
      .select("*")
      .eq("user_id", auth.userId);

    if (parsed.status) query = query.eq("status", parsed.status);

    const sortBy = parsed.sort_by ?? "created_at";
    const sortOrder = parsed.sort_order ?? "desc";
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    if (parsed.limit) query = query.limit(parsed.limit);
    if (parsed.offset) query = query.range(parsed.offset, parsed.offset + (parsed.limit ?? 100) - 1);

    if (parsed.search) {
      const searchTerm = `%${parsed.search}%`;
      query = query.or(
        `scheme_name.ilike.${searchTerm},provider.ilike.${searchTerm},investment_type.ilike.${searchTerm}`,
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("investments GET error:", error);
      return NextResponse.json(
        { error: "Unable to retrieve investments." },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: data ?? [] });
  } catch (error) {
    console.error("investments GET unhandled:", error);
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
    const parsed = parseOrError(investmentCreateSchema, body);
    if (parsed instanceof NextResponse) return parsed;

    const payload = {
      user_id: auth.userId,
      investment_type: parsed.investment_type,
      provider: parsed.provider ?? null,
      scheme_name: parsed.scheme_name,
      amount: parsed.amount ?? null,
      frequency: parsed.frequency ?? null,
      start_date: parsed.start_date ?? null,
      status: parsed.status ?? "active",
      metadata: parsed.metadata ?? {},
    };

    const { data, error } = await supabaseAdmin
      .from("investments")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      console.error("investments POST error:", error);
      return NextResponse.json(
        { error: "Unable to create investment." },
        { status: 500 },
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("investments POST unhandled:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
