import { Metadata } from "next";
import { ViewDecisionClient } from "@/components/decisions/view-decision-client";

export const metadata: Metadata = {
  title: "Historical Decision | NIRNAY",
};

export default async function ViewDecisionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6 lg:p-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Historical Decision
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Review the product and your profile context exactly as they were when you saved this decision.
        </p>
      </div>

      <ViewDecisionClient id={parseInt(id, 10)} />
    </div>
  );
}
