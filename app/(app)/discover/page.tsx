import type { Metadata } from "next";
import { Suspense } from "react";
import { DiscoverBootstrap } from "@/components/discover/discover-bootstrap";
import { Loader2, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Discover",
  description:
    "Find insurance and investment products suited to your financial profile. Compare health, motor, and term life insurance alongside SIP and mutual fund options.",
};

export default function DiscoverPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 lg:p-8">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Discover
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Explore insurance and investment products. Your profile shapes the
          match score — it is not financial advice.
        </p>
      </div>

      {/* Trust / Simulated Data Disclosure */}
      <div className="flex items-start gap-3 rounded-xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p>
          <strong className="font-medium text-foreground">Simulated marketplace data</strong> — Insurance and investment products shown here use simulated data for this prototype. Product details, prices, returns and availability are not live offers.
        </p>
      </div>

      {/* Bootstrap: resolves auth, loads profile + watchlist, renders grid */}
      <Suspense fallback={<div className="flex items-center justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}>
        <DiscoverBootstrap />
      </Suspense>
    </div>
  );
}
