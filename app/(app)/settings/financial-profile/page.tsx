import type { Metadata } from "next";
import { FinancialProfileLoader } from "@/components/financial-profile/profile-loader";

export const metadata: Metadata = {
  title: "Financial Profile",
};

/**
 * /settings/financial-profile
 *
 * Server page shell — metadata + layout wrapper.
 * The interactive multi-step form lives in the client component
 * FinancialProfileLoader, which handles auth and data-loading before
 * rendering the form.
 */
export default function FinancialProfilePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6 lg:p-8">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Financial profile
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Help NIRNAY understand your financial context so it can surface
          products and recommendations relevant to you.
        </p>
      </div>

      {/* Multi-step form — client component */}
      <FinancialProfileLoader />
    </div>
  );
}
