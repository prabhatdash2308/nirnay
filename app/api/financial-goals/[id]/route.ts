import "server-only";
import { NextResponse } from "next/server";
import { authenticateRequest, isAuthContext } from "@/app/lib/auth-server";
import { supabaseAdmin } from "@/app/lib/supabase-server";
import {
  parseOrError,
  financialGoalUpdateSchema,
} from "@/app/lib/validation";

export const runtime = "nodejs";

function parseId(raw: string | undefined): number | NextResponse {
  if (!raw) {
    return NextResponse.json(
      { error: "Record ID is required." },
      { status: 400 },
    );
  }
  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) {
    return NextResponse.json(
      { error: "Record ID must be a positive integer." },
      { status: 400 },
    );
  }
  return n;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await authenticateRequest(request);
    if (!isAuthContext(auth)) return auth;

    const idParam = parseId((await params).id);
    if (idParam instanceof NextResponse) return idParam;

    const { data, error } = await supabaseAdmin
      .from("financial_goals")
      .select("*")
      .eq("id", idParam)
      .eq("user_id", auth.userId)
      .maybeSingle();

    if (error) {
      console.error("financial-goal GET error:", error);
      return NextResponse.json(
        { error: "Unable to retrieve goal." },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Goal not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("financial-goal GET unhandled:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await authenticateRequest(request);
    if (!isAuthContext(auth)) return auth;

    const idParam = parseId((await params).id);
    if (idParam instanceof NextResponse) return idParam;

    const body = await request.json().catch(() => ({}));
    const parsed = parseOrError(financialGoalUpdateSchema, body);
    if (parsed instanceof NextResponse) return parsed;

    const updates: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (v !== undefined) updates[k] = v;
    }

    const { data, error } = await supabaseAdmin
      .from("financial_goals")
      .update(updates)
      .eq("id", idParam)
      .eq("user_id", auth.userId)
      .select("*")
      .maybeSingle();

    if (error) {
      console.error("financial-goal PATCH error:", error);
      return NextResponse.json(
        { error: "Unable to update goal." },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Goal not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("financial-goal PATCH unhandled:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await authenticateRequest(request);
    if (!isAuthContext(auth)) return auth;

    const idParam = parseId((await params).id);
    if (idParam instanceof NextResponse) return idParam;

    const { error, count } = await supabaseAdmin
      .from("financial_goals")
      .delete({ count: "exact" })
      .eq("id", idParam)
      .eq("user_id", auth.userId);

    if (error) {
      console.error("financial-goal DELETE error:", error);
      return NextResponse.json(
        { error: "Unable to delete goal." },
        { status: 500 },
      );
    }

    if (!count || count === 0) {
      return NextResponse.json(
        { error: "Goal not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("financial-goal DELETE unhandled:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
