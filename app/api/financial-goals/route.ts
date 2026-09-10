import "server-only";
import { NextResponse } from "next/server";
import { authenticateRequest, isAuthContext } from "@/app/lib/auth-server";
import { supabaseAdmin } from "@/app/lib/supabase-server";
import {
  parseOrError,
  financialGoalCreateSchema,
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
      .from("financial_goals")
      .select("*")
      .eq("user_id", auth.userId);

    if (parsed.status) query = query.eq("status", parsed.status);

    const sortBy = parsed.sort_by ?? "priority";
    const sortOrder = parsed.sort_order ?? "asc";
    if (sortBy === "priority") {
      query = query.order("status", { ascending: sortOrder === "asc" });
    } else {
      query = query.order(sortBy, { ascending: sortOrder === "asc" });
    }
    query = query.order("target_date", {
      ascending: true,
      nullsFirst: false,
    });

    if (parsed.limit) query = query.limit(parsed.limit);
    if (parsed.offset) query = query.range(parsed.offset, parsed.offset + (parsed.limit ?? 100) - 1);

    if (parsed.search) {
      const searchTerm = `%${parsed.search}%`;
      query = query.or(`name.ilike.${searchTerm},goal_type.ilike.${searchTerm}`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("financial-goals GET error:", error);
      return NextResponse.json(
        { error: "Unable to retrieve financial goals." },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: data ?? [] });
  } catch (error) {
    console.error("financial-goals GET unhandled:", error);
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
    const parsed = parseOrError(financialGoalCreateSchema, body);
    if (parsed instanceof NextResponse) return parsed;

    const payload = {
      user_id: auth.userId,
      name: parsed.name,
      goal_type: parsed.goal_type ?? "custom",
      target_amount: parsed.target_amount,
      current_amount: parsed.current_amount ?? 0,
      target_date: parsed.target_date ?? null,
      priority: parsed.priority ?? "medium",
      status: parsed.status ?? "active",
      metadata: parsed.metadata ?? {},
    };

    const { data, error } = await supabaseAdmin
      .from("financial_goals")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      console.error("financial-goals POST error:", error);
      return NextResponse.json(
        { error: "Unable to create financial goal." },
        { status: 500 },
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("financial-goals POST unhandled:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
