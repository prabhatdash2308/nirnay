import type { Metadata } from "next";
import { PortfolioClient } from "@/components/portfolio/portfolio-client";

export const metadata: Metadata = {
  title: "Portfolio",
};

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 lg:p-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Portfolio
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your protection, investments, and financial priorities in one place.
        </p>
      </div>

      <PortfolioClient />
    </div>
  );
}
