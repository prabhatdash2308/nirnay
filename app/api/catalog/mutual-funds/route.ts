import "server-only";
import { NextResponse } from "next/server";
import { authenticateRequest, isAuthContext } from "@/app/lib/auth-server";
import { supabaseAdmin } from "@/app/lib/supabase-server";
import {
  parseOrError,
  mutualFundCatalogQuerySchema,
} from "@/app/lib/validation";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if (!isAuthContext(auth)) return auth;

    const { searchParams } = new URL(request.url);
    const qp = Object.fromEntries(searchParams.entries());
    const parsed = parseOrError(mutualFundCatalogQuerySchema, qp);
    if (parsed instanceof NextResponse) return parsed;

    let query = supabaseAdmin.from("mutual_funds").select("*");

    if (parsed.fund_category) query = query.eq("fund_category", parsed.fund_category);
    if (parsed.risk_level) query = query.eq("risk_level", parsed.risk_level);
    if (parsed.max_sip_amount != null)
      query = query.lte("sip_min_amount", parsed.max_sip_amount);
    if (parsed.min_returns_1y != null)
      query = query.gte("returns_1y", parsed.min_returns_1y);

    query = query.order("returns_3y", {
      ascending: false,
      nullsFirst: false,
    });

    if (parsed.limit) query = query.limit(parsed.limit);

    const { data, error } = await query;

    if (error) {
      console.error("mutual-fund-catalog GET error:", error);
      return NextResponse.json(
        { error: "Unable to retrieve mutual fund catalog." },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: data ?? [] });
  } catch (error) {
    console.error("mutual-fund-catalog GET unhandled:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
