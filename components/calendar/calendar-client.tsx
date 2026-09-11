"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "@/app/lib/firebase-client";
import { loadCalendarData } from "@/app/(app)/calendar/actions";
import type { CalendarData, CalendarEvent } from "@/lib/types/calendar";
import {
  calcCalendarSummary,
  filterNeedsAttention,
  formatDaysLabel,
} from "@/lib/calendar/calculations";
import {
  Loader2,
  CalendarDays,
  AlertTriangle,
  Clock,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Target,
  Calendar,
  TrendingUp,
  Inbox,
} from "lucide-react";
import { cn } from "cn";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatEventDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function renderEventIcon(
  type: CalendarEvent["type"],
  className: string
): React.ReactElement {
  switch (type) {
    case "insurance_renewal":
    case "premium_payment":
      return <ShieldCheck className={className} />;
    case "goal_milestone":
      return <Target className={className} />;
    case "sip":
    case "investment_review":
      return <TrendingUp className={className} />;
    default:
      return <Calendar className={className} />;
  }
}

function urgencyBadgeClass(urgency: CalendarEvent["urgency"]): string {
  switch (urgency) {
    case "overdue":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "today":
      return "bg-orange-500/10 text-orange-600 border-orange-200 dark:text-orange-400";
    case "this_week":
      return "bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:text-yellow-400";
    case "this_month":
      return "bg-blue-500/10 text-blue-700 border-blue-200 dark:text-blue-400";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

function urgencyLabel(urgency: CalendarEvent["urgency"]): string {
  switch (urgency) {
    case "overdue":
      return "Overdue";
    case "today":
      return "Today";
    case "this_week":
      return "This week";
    case "this_month":
      return "This month";
    default:
      return "Upcoming";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

interface EventCardProps {
  event: CalendarEvent;
  compact?: boolean;
}

function EventCard({ event, compact = false }: EventCardProps) {
  const daysLabel = formatDaysLabel(event.daysFromToday);
  const isNegative = event.daysFromToday < 0;

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4 transition-colors hover:bg-muted/40",
        isNegative && "border-destructive/30"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
            event.urgency === "overdue"
              ? "bg-destructive/10 border-destructive/20 text-destructive"
              : event.urgency === "today"
              ? "bg-orange-500/10 border-orange-200 text-orange-600 dark:text-orange-400"
              : "bg-primary/10 border-primary/20 text-primary"
          )}
        >
          {renderEventIcon(event.type, "h-4 w-4")}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-foreground truncate">
              {event.title}
            </p>
            <span
              className={cn(
                "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                urgencyBadgeClass(event.urgency)
              )}
            >
              {urgencyLabel(event.urgency)}
            </span>
          </div>

          {!compact && event.description && (
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
              {event.description}
            </p>
          )}

          <div className="mt-1.5 flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatEventDate(event.date)}
            </span>
            <span
              className={cn(
                "text-xs font-medium",
                isNegative ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {daysLabel}
            </span>
          </div>
        </div>

        {/* Action link */}
        {event.actionUrl && (
          <Link
            href={event.actionUrl}
            className="shrink-0 flex items-center gap-1 text-xs font-medium text-primary hover:underline mt-0.5"
          >
            {event.actionLabel ?? "View"}
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Summary cards
// ─────────────────────────────────────────────────────────────────────────────

interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  variant?: "default" | "warning" | "danger";
}

function SummaryCard({
  label,
  value,
  icon: Icon,
  variant = "default",
}: SummaryCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4",
        variant === "danger" && value > 0 && "border-destructive/30",
        variant === "warning" && value > 0 && "border-orange-200 dark:border-orange-900"
      )}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
            variant === "danger" && value > 0
              ? "bg-destructive/10 text-destructive"
              : variant === "warning" && value > 0
              ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
              : "bg-muted text-muted-foreground"
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xl font-bold text-foreground leading-none">
            {value}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────────────────────────────────────

function EmptyCalendar() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
        <Inbox className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">
        Your financial calendar is clear.
      </p>
      <p className="mt-1 text-xs text-muted-foreground max-w-xs">
        No upcoming financial actions yet. Add a policy with a renewal date or a
        goal with a target date to see them here.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Add a policy
        </Link>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
        >
          <Target className="h-3.5 w-3.5" />
          Create a goal
        </Link>
        <Link
          href="/discover"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Explore products
        </Link>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main client component
// ─────────────────────────────────────────────────────────────────────────────

export function CalendarClient() {
  const [data, setData] = useState<CalendarData | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataError, setDataError] = useState(false);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  const loadData = useCallback(async (token: string) => {
    const result = await loadCalendarData(token);
    setData(result);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      setAuthLoading(false);

      if (!user) {
        setData(null);
        setIdToken(null);
        return;
      }

      try {
        const token = await user.getIdToken();
        setIdToken(token);
        await loadData(token);
      } catch (err) {
        console.error("[calendar] Data load error:", err);
        setDataError(true);
      }
    });

    return () => unsubscribe();
  }, [loadData]);

  // ─── 1. Auth loading ───────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">
          Loading your calendar...
        </p>
      </div>
    );
  }

  // ─── 2. Unauthenticated ────────────────────────────────────────────────────
  if (!idToken) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm font-medium text-foreground">
          Sign in to view your financial calendar
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Your financial data is private and requires authentication.
        </p>
        <Link
          href="/auth"
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  // ─── 3. Authenticated but data fetch failed ────────────────────────────────
  if (dataError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="h-8 w-8 text-muted-foreground mb-3" />
        <p className="text-sm font-medium text-foreground">
          Unable to load calendar
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Something went wrong loading your financial data. Please try again.
        </p>
        <button
          disabled={retrying}
          onClick={async () => {
            if (!idToken) return;
            setRetrying(true);
            setDataError(false);
            try {
              await loadData(idToken);
            } catch {
              setDataError(true);
            } finally {
              setRetrying(false);
            }
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {retrying && <Loader2 className="h-4 w-4 animate-spin" />}
          <RefreshCw className={cn("h-4 w-4", retrying && "hidden")} />
          Try Again
        </button>
      </div>
    );
  }

  // ─── 4. Data loading in flight ─────────────────────────────────────────────
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-sm text-muted-foreground">
          Loading calendar...
        </p>
      </div>
    );
  }

  // ─── 5. Authenticated and data loaded ─────────────────────────────────────
  const { events } = data;
  const summary = calcCalendarSummary(events);
  const needsAttention = filterNeedsAttention(events);

  // Events beyond the needs-attention window
  const upcomingEvents = events.filter(
    (e) => e.urgency === "this_month" || e.urgency === "upcoming"
  );

  return (
    <div className="space-y-6">
      {/* Summary metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard
          label="Needs attention"
          value={summary.needsAttentionCount}
          icon={AlertTriangle}
          variant="danger"
        />
        <SummaryCard
          label="Due today"
          value={summary.todayCount}
          icon={Clock}
          variant="warning"
        />
        <SummaryCard
          label="This month"
          value={summary.thisMonthCount}
          icon={CalendarDays}
        />
        <SummaryCard
          label="Total upcoming"
          value={summary.totalUpcoming + summary.thisMonthCount}
          icon={CheckCircle}
        />
      </div>

      {/* Needs Attention */}
      {needsAttention.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h3 className="text-sm font-semibold text-foreground">
              Needs Attention
            </h3>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-destructive/10 text-[11px] font-bold text-destructive">
              {needsAttention.length}
            </span>
          </div>
          <div className="space-y-2">
            {needsAttention.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Actions */}
      {upcomingEvents.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">
              Upcoming Actions
            </h3>
          </div>
          <div className="space-y-2">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {events.length === 0 && <EmptyCalendar />}
    </div>
  );
}
