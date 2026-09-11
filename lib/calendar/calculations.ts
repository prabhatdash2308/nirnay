import type {
  CalendarEvent,
  CalendarEventUrgency,
  CalendarEventStatus,
  FinancialCalendarRow,
} from "@/lib/types/calendar";
import type { InsurancePolicy } from "@/lib/types/portfolio";
import type { FinancialGoal } from "@/lib/types/portfolio";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** How many days ahead to consider a renewal "upcoming" / needs attention. */
export const UPCOMING_RENEWAL_DAYS = 30;

/** How many days until an event is considered "this week". */
export const THIS_WEEK_DAYS = 7;

// ─────────────────────────────────────────────────────────────────────────────
// Core date utility
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate the number of whole calendar days between today (midnight) and
 * an event date (also midnight). Positive = future, negative = past.
 *
 * We compare date strings (YYYY-MM-DD) to avoid timezone drift when the server
 * and user are in different zones.
 */
export function calcDaysFromToday(eventDateStr: string, today: Date = new Date()): number {
  // Normalize today to midnight UTC to compare date-only values
  const todayMidnight = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const [year, month, day] = eventDateStr.split("-").map(Number);
  const eventMidnight = Date.UTC(year, month - 1, day);

  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((eventMidnight - todayMidnight) / msPerDay);
}

/**
 * Determine urgency from days-from-today.
 */
export function calcUrgency(daysFromToday: number): CalendarEventUrgency {
  if (daysFromToday < 0) return "overdue";
  if (daysFromToday === 0) return "today";
  if (daysFromToday <= THIS_WEEK_DAYS) return "this_week";
  if (daysFromToday <= UPCOMING_RENEWAL_DAYS) return "this_month";
  return "upcoming";
}

/**
 * Human-readable relative date label.
 * Examples:
 *   "Overdue by 3 days"
 *   "Due today"
 *   "In 5 days"
 *   "In 25 days"
 */
export function formatDaysLabel(daysFromToday: number): string {
  if (daysFromToday < 0) {
    const abs = Math.abs(daysFromToday);
    return `Overdue by ${abs} day${abs !== 1 ? "s" : ""}`;
  }
  if (daysFromToday === 0) return "Due today";
  return `In ${daysFromToday} day${daysFromToday !== 1 ? "s" : ""}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Build events from financial_calendar DB rows
// ─────────────────────────────────────────────────────────────────────────────

export function buildEventsFromCalendarRows(
  rows: FinancialCalendarRow[],
  today: Date = new Date()
): CalendarEvent[] {
  return rows
    .filter((row) => row.status !== "cancelled" && row.status !== "skipped")
    .map((row): CalendarEvent => {
      const daysFromToday = calcDaysFromToday(row.event_date, today);
      const urgency = calcUrgency(daysFromToday);

      return {
        id: `db-${row.id}`,
        title: row.title,
        type: row.event_type,
        date: row.event_date,
        status: row.status,
        description: row.description ?? undefined,
        urgency,
        daysFromToday,
        source: "db",
        // No actionUrl for generic db rows — they were manually created
      };
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Build events from insurance_policies.renewal_date
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Derives calendar events from insurance policy renewal dates.
 *
 * Rules:
 * - Only active policies with a non-null renewal_date are included.
 * - Events use a stable id: `policy-renewal-<policy.id>` to prevent
 *   duplication if the financial_calendar table also has a manual row.
 * - Action links to /discover (safer than a fake product ID).
 */
export function buildEventsFromPolicies(
  policies: InsurancePolicy[],
  today: Date = new Date()
): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  for (const policy of policies) {
    if (policy.status !== "active") continue;
    if (!policy.renewal_date) continue;

    const daysFromToday = calcDaysFromToday(policy.renewal_date, today);
    const urgency = calcUrgency(daysFromToday);

    const typeLabel =
      policy.policy_type === "health"
        ? "Health insurance"
        : policy.policy_type === "motor"
        ? "Motor insurance"
        : policy.policy_type === "life"
        ? "Life insurance"
        : "Insurance";

    events.push({
      id: `policy-renewal-${policy.id}`,
      title: `${policy.policy_name} renewal`,
      type: "insurance_renewal",
      date: policy.renewal_date,
      status: "upcoming" as CalendarEventStatus,
      description: `${typeLabel} policy renewal — ${policy.provider}.`,
      urgency,
      daysFromToday,
      source: "policy",
      actionUrl: "/discover",
      actionLabel: "Review options",
    });
  }

  return events;
}

// ─────────────────────────────────────────────────────────────────────────────
// Build events from financial_goals.target_date
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Derives calendar events from financial goal target dates.
 *
 * Rules:
 * - Only active goals with a non-null target_date are included.
 * - Stable id: `goal-milestone-<goal.id>`.
 * - No action link (no specific discovery page for goals).
 */
export function buildEventsFromGoals(
  goals: FinancialGoal[],
  today: Date = new Date()
): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  for (const goal of goals) {
    if (goal.status !== "active") continue;
    if (!goal.target_date) continue;

    const daysFromToday = calcDaysFromToday(goal.target_date, today);
    const urgency = calcUrgency(daysFromToday);

    events.push({
      id: `goal-milestone-${goal.id}`,
      title: `Goal: ${goal.name}`,
      type: "goal_milestone",
      date: goal.target_date,
      status: "upcoming" as CalendarEventStatus,
      description: `Target date for your "${goal.name}" goal.`,
      urgency,
      daysFromToday,
      source: "goal",
      actionUrl: "/portfolio",
      actionLabel: "View goal",
    });
  }

  return events;
}

// ─────────────────────────────────────────────────────────────────────────────
// Merge and deduplicate
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Merge events from all sources, deduplicating by stable ID, then sort
 * chronologically with overdue items first.
 *
 * Priority order (ascending daysFromToday, overdue = most negative first):
 *   overdue → today → this_week → this_month → upcoming
 */
export function mergeAndSortEvents(
  ...eventLists: CalendarEvent[][]
): CalendarEvent[] {
  const seen = new Set<string>();
  const merged: CalendarEvent[] = [];

  for (const list of eventLists) {
    for (const event of list) {
      if (!seen.has(event.id)) {
        seen.add(event.id);
        merged.push(event);
      }
    }
  }

  // Sort: overdue first (most negative days), then soonest future
  merged.sort((a, b) => a.daysFromToday - b.daysFromToday);

  return merged;
}

// ─────────────────────────────────────────────────────────────────────────────
// Summary metrics
// ─────────────────────────────────────────────────────────────────────────────

export interface CalendarSummary {
  overdueCount: number;
  todayCount: number;
  thisWeekCount: number;
  thisMonthCount: number;
  totalUpcoming: number;
  needsAttentionCount: number;
}

export function calcCalendarSummary(events: CalendarEvent[]): CalendarSummary {
  let overdueCount = 0;
  let todayCount = 0;
  let thisWeekCount = 0;
  let thisMonthCount = 0;
  let totalUpcoming = 0;

  for (const event of events) {
    if (event.urgency === "overdue") overdueCount++;
    else if (event.urgency === "today") todayCount++;
    else if (event.urgency === "this_week") thisWeekCount++;
    else if (event.urgency === "this_month") thisMonthCount++;
    else totalUpcoming++;
  }

  return {
    overdueCount,
    todayCount,
    thisWeekCount,
    thisMonthCount,
    totalUpcoming,
    // "Needs attention" = overdue + today + this_week
    needsAttentionCount: overdueCount + todayCount + thisWeekCount,
  };
}

/**
 * Filter events that "need attention":
 * overdue, due today, or due within this week (≤ 7 days).
 */
export function filterNeedsAttention(events: CalendarEvent[]): CalendarEvent[] {
  return events.filter(
    (e) =>
      e.urgency === "overdue" ||
      e.urgency === "today" ||
      e.urgency === "this_week"
  );
}
