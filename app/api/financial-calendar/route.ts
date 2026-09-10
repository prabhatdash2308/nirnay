import "server-only";
import { NextResponse } from "next/server";
import { authenticateRequest, isAuthContext } from "@/app/lib/auth-server";
import { supabaseAdmin } from "@/app/lib/supabase-server";
import {
  parseOrError,
  calendarEventCreateSchema,
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
      .from("financial_calendar")
      .select("*")
      .eq("user_id", auth.userId);

    if (parsed.status) query = query.eq("status", parsed.status);

    const sortBy = parsed.sort_by ?? "event_date";
    const sortOrder = parsed.sort_order ?? "asc";
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    if (parsed.limit) query = query.limit(parsed.limit);
    if (parsed.offset) query = query.range(parsed.offset, parsed.offset + (parsed.limit ?? 100) - 1);

    if (parsed.search) {
      const searchTerm = `%${parsed.search}%`;
      query = query.or(
        `title.ilike.${searchTerm},description.ilike.${searchTerm},event_type.ilike.${searchTerm}`,
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("financial-calendar GET error:", error);
      return NextResponse.json(
        { error: "Unable to retrieve calendar events." },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: data ?? [] });
  } catch (error) {
    console.error("financial-calendar GET unhandled:", error);
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
    const parsed = parseOrError(calendarEventCreateSchema, body);
    if (parsed instanceof NextResponse) return parsed;

    const payload = {
      user_id: auth.userId,
      event_type: parsed.event_type,
      title: parsed.title,
      description: parsed.description ?? null,
      event_date: parsed.event_date,
      status: parsed.status ?? "upcoming",
      metadata: parsed.metadata ?? {},
    };

    const { data, error } = await supabaseAdmin
      .from("financial_calendar")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      console.error("financial-calendar POST error:", error);
      return NextResponse.json(
        { error: "Unable to create calendar event." },
        { status: 500 },
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("financial-calendar POST unhandled:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
