import "server-only";
import { NextResponse } from "next/server";
import { authenticateRequest, isAuthContext } from "@/app/lib/auth-server";
import { supabaseAdmin } from "@/app/lib/supabase-server";
import { parseOrError, watchlistAddSchema, listQuerySchema } from "@/app/lib/validation";

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
      .from("watchlist")
      .select("*")
      .eq("user_id", auth.userId);

    if (qp?.search) {
      const searchTerm = `%${parsed.search}%`;
      query = query.or(
        `product_id.ilike.${searchTerm},product_type.ilike.${searchTerm}`,
      );
    }

    query = query.order("created_at", { ascending: false });

    if (parsed.limit) query = query.limit(parsed.limit);

    const { data, error } = await query;

    if (error) {
      console.error("watchlist GET error:", error);
      return NextResponse.json(
        { error: "Unable to retrieve watchlist." },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: data ?? [] });
  } catch (error) {
    console.error("watchlist GET unhandled:", error);
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
    const parsed = parseOrError(watchlistAddSchema, body);
    if (parsed instanceof NextResponse) return parsed;

    const payload = {
      user_id: auth.userId,
      product_type: parsed.product_type,
      product_id: parsed.product_id,
    };

    const { data, error } = await supabaseAdmin
      .from("watchlist")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      console.error("watchlist POST error:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Item already exists in watchlist." },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: "Unable to add item to watchlist." },
        { status: 500 },
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("watchlist POST unhandled:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
