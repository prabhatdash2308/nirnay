import type { Metadata } from "next";
import { CalendarClient } from "@/components/calendar/calendar-client";

export const metadata: Metadata = {
  title: "Financial Calendar",
  description:
    "Stay ahead of renewals, investment events, and financial milestones with your personal financial calendar.",
};

export default function CalendarPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6 lg:p-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Financial Calendar
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Stay ahead of renewals, goals, and recurring financial actions.
        </p>
      </div>

      <CalendarClient />
    </div>
  );
}
