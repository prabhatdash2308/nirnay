import type { Metadata } from "next";
import { Suspense } from "react";
import { DiscoverBootstrap } from "@/components/discover/discover-bootstrap";
import { Loader2 } from "lucide-react";

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

      {/* Bootstrap: resolves auth, loads profile + watchlist, renders grid */}
      <Suspense fallback={<div className="flex items-center justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}>
        <DiscoverBootstrap />
      </Suspense>
    </div>
  );
}
