import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2, Info } from "lucide-react";
import { resolveCompareProducts } from "@/lib/compare/utils";
import { CompareClient } from "@/components/compare/compare-client";

export const metadata: Metadata = {
  title: "Compare",
  description:
    "Compare insurance and investment products side-by-side. See key features, indicative costs, and your profile match score in one view.",
};

// ─────────────────────────────────────────────────────────────────────────────
// The page is a Server Component.
//
// It reads the ?add= params from the URL and validates them against the static
// catalogue server-side. This means:
//
// - The initial HTML includes the resolved product data (no client fetch)
// - Invalid product IDs are silently dropped before the client sees them
// - The page is statically generated at build time (no params = no data)
//
// URL state flow:
//   /compare?add=<id1>&add=<id2>
//     ↓
//   Server resolves + validates product IDs
//     ↓
//   CompareClient receives initialProducts
//     ↓
//   Client handles add/remove via router.push()
// ─────────────────────────────────────────────────────────────────────────────

interface ComparePageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;

  // Parse the ?add= params — may be a string (single) or string[] (multiple)
  const rawAdd = params["add"];
  const addParams: string[] = !rawAdd
    ? []
    : Array.isArray(rawAdd)
      ? rawAdd
      : [rawAdd];

  // Validate: resolve only products that exist in the catalogue
  // Invalid IDs are silently dropped — never crash, never trust user input
  const initialProducts = resolveCompareProducts(addParams);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 lg:p-8">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Compare
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Compare products side-by-side. Your profile shapes the match score —
          it is not financial advice.
        </p>
      </div>

      {/* Trust / Simulated Data Disclosure */}
      <div className="flex items-start gap-3 rounded-xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p>
          <strong className="font-medium text-foreground">Simulated marketplace data</strong> — Insurance and investment products shown here use simulated data for this prototype. Product details, prices, returns and availability are not live offers.
        </p>
      </div>

      {/*
        Suspense boundary: CompareClient uses useSearchParams() which requires
        a Suspense boundary when rendered inside a Server Component with
        dynamic params in Next.js 16+.
      */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <CompareClient initialProducts={initialProducts} />
      </Suspense>
    </div>
  );
}
