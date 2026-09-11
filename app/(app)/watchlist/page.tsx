import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { WatchlistBootstrap } from "@/components/watchlist/watchlist-bootstrap";

export const metadata: Metadata = {
  title: "Watchlist | NIRNAY",
  description: "Products you've saved for later.",
};

export default function WatchlistPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 lg:p-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Watchlist
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Products you&apos;ve saved for later.
        </p>
      </div>

      {/* Bootstrap resolves auth, loads profile + watchlist ids on client */}
      <Suspense fallback={<div className="flex items-center justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}>
        <WatchlistBootstrap />
      </Suspense>
    </div>
  );
}
