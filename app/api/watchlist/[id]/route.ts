import "server-only";
import { NextResponse } from "next/server";
import { authenticateRequest, isAuthContext } from "@/app/lib/auth-server";
import { supabaseAdmin } from "@/app/lib/supabase-server";

export const runtime = "nodejs";

function parseId(raw: string | undefined): number | NextResponse {
  if (!raw) {
    return NextResponse.json(
      { error: "Watchlist item ID is required." },
      { status: 400 },
    );
  }
  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) {
    return NextResponse.json(
      { error: "Watchlist item ID must be a positive integer." },
      { status: 400 },
    );
  }
  return n;
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
      .from("watchlist")
      .delete({ count: "exact" })
      .eq("id", idParam)
      .eq("user_id", auth.userId);

    if (error) {
      console.error("watchlist DELETE error:", error);
      return NextResponse.json(
        { error: "Unable to remove item from watchlist." },
        { status: 500 },
      );
    }

    if (!count || count === 0) {
      return NextResponse.json(
        { error: "Watchlist item not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("watchlist DELETE unhandled:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
