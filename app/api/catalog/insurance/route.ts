import "server-only";
import { NextResponse } from "next/server";
import { authenticateRequest, isAuthContext } from "@/app/lib/auth-server";
import { supabaseAdmin } from "@/app/lib/supabase-server";
import {
  parseOrError,
  insuranceCatalogQuerySchema,
} from "@/app/lib/validation";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if (!isAuthContext(auth)) return auth;

    const { searchParams } = new URL(request.url);
    const qp = Object.fromEntries(searchParams.entries());
    const parsed = parseOrError(insuranceCatalogQuerySchema, qp);
    if (parsed instanceof NextResponse) return parsed;

    let query = supabaseAdmin.from("insurance_products").select("*");

    if (parsed.product_type) query = query.eq("product_type", parsed.product_type);
    if (parsed.provider) query = query.ilike("provider", `%${parsed.provider}%`);
    if (parsed.max_premium != null)
      query = query.lte("base_premium", parsed.max_premium);
    if (parsed.min_sum_insured != null)
      query = query.gte("sum_insured_default", parsed.min_sum_insured);

    query = query.order("base_premium", {
      ascending: true,
      nullsFirst: false,
    });

    if (parsed.limit) query = query.limit(parsed.limit);

    const { data, error } = await query;

    if (error) {
      console.error("insurance-catalog GET error:", error);
      return NextResponse.json(
        { error: "Unable to retrieve insurance product catalog." },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: data ?? [] });
  } catch (error) {
    console.error("insurance-catalog GET unhandled:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
