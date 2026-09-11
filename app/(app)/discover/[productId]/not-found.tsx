import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center gap-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Compass className="h-7 w-7 text-muted-foreground" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-foreground">Product not found</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          We couldn&apos;t find a product with that ID in our catalogue.
        </p>
      </div>
      <Link
        href="/discover"
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Discover
      </Link>
    </div>
  );
}
