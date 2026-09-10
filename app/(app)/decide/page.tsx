import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { resolveCompareProducts } from "@/lib/compare/utils";
import { DecideClient } from "@/components/decide/decide-client";

export const metadata: Metadata = {
  title: "Decide Guidance",
  description:
    "Review profile-based suitability, objective product highlights, and important limitations to help you decide.",
};

// ─────────────────────────────────────────────────────────────────────────────
// The Decide page is a Server Component.
//
// It reads the ?add= params from the URL exactly like the Compare page.
// The identical param-parsing structure allows seamless transitions between
// Compare and Decide.
// ─────────────────────────────────────────────────────────────────────────────

interface DecidePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DecidePage({ searchParams }: DecidePageProps) {
  const params = await searchParams;

  const rawAdd = params["add"];
  const addParams: string[] = !rawAdd
    ? []
    : Array.isArray(rawAdd)
      ? rawAdd
      : [rawAdd];

  // Safely resolve products using the same utility as Compare
  const initialProducts = resolveCompareProducts(addParams);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6 lg:p-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Decision Guidance
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Review which product best aligns with your financial profile. This is
          heuristic guidance, not financial advice.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <DecideClient initialProducts={initialProducts} />
      </Suspense>
    </div>
  );
}
