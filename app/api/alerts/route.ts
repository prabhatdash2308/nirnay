import "server-only";
import { NextResponse } from "next/server";
import { authenticateRequest, isAuthContext } from "@/app/lib/auth-server";
import { supabaseAdmin } from "@/app/lib/supabase-server";
import {
  parseOrError,
  alertCreateSchema,
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
      .from("alerts")
      .select("*")
      .eq("user_id", auth.userId);

    if (parsed.status === "read") {
      query = query.not("read_at", "is", null);
    } else if (parsed.status === "unread") {
      query = query.is("read_at", null);
    }

    const sortBy = parsed.sort_by ?? "scheduled_for";
    const sortOrder = parsed.sort_order ?? "desc";
    query = query.order(sortBy, { ascending: sortOrder === "asc", nullsFirst: false });
    query = query.order("created_at", { ascending: false });

    if (parsed.limit) query = query.limit(parsed.limit);
    if (parsed.offset) query = query.range(parsed.offset, parsed.offset + (parsed.limit ?? 100) - 1);

    if (parsed.search) {
      const searchTerm = `%${parsed.search}%`;
      query = query.or(`title.ilike.${searchTerm},message.ilike.${searchTerm}`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("alerts GET error:", error);
      return NextResponse.json(
        { error: "Unable to retrieve alerts." },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: data ?? [] });
  } catch (error) {
    console.error("alerts GET unhandled:", error);
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
    const parsed = parseOrError(alertCreateSchema, body);
    if (parsed instanceof NextResponse) return parsed;

    const payload = {
      user_id: auth.userId,
      alert_type: parsed.alert_type,
      title: parsed.title,
      message: parsed.message,
      severity: parsed.severity ?? "info",
      scheduled_for: parsed.scheduled_for ?? null,
      metadata: parsed.metadata ?? {},
    };

    const { data, error } = await supabaseAdmin
      .from("alerts")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      console.error("alerts POST error:", error);
      return NextResponse.json(
        { error: "Unable to create alert." },
        { status: 500 },
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("alerts POST unhandled:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
