import { z } from "zod";

// ─────────────────────────────────────────────────────────────────────────────
// Calendar Event Types
//
// Supported values come directly from the financial_calendar.event_type CHECK
// constraint in the Supabase migration.
// ─────────────────────────────────────────────────────────────────────────────

export const calendarEventTypeSchema = z.enum([
  "insurance_renewal",
  "premium_payment",
  "sip",
  "goal_milestone",
  "investment_review",
  "other",
]);

export type CalendarEventType = z.infer<typeof calendarEventTypeSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Calendar Event Status
//
// Values from the financial_calendar.status CHECK constraint.
// ─────────────────────────────────────────────────────────────────────────────

export const calendarEventStatusSchema = z.enum([
  "upcoming",
  "completed",
  "skipped",
  "cancelled",
]);

export type CalendarEventStatus = z.infer<typeof calendarEventStatusSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Urgency / Priority
//
// Calculated deterministically from the event_date at render time.
// Not stored in the database.
// ─────────────────────────────────────────────────────────────────────────────

export type CalendarEventUrgency =
  | "overdue"
  | "today"
  | "this_week"
  | "this_month"
  | "upcoming";

// ─────────────────────────────────────────────────────────────────────────────
// CalendarEvent — the unified display model
//
// This type is used throughout the UI. It is produced either by:
//   a) reading rows from the `financial_calendar` table, or
//   b) deriving events deterministically from insurance_policies.renewal_date
//      or financial_goals.target_date.
//
// The `source` field distinguishes the origin of each event so the UI
// can render appropriate context.
// ─────────────────────────────────────────────────────────────────────────────

export interface CalendarEvent {
  /** Stable, unique ID for React keying and deduplication. */
  id: string;

  /** Display title. */
  title: string;

  /** One of the supported event types. */
  type: CalendarEventType;

  /**
   * ISO date string (YYYY-MM-DD) from the database.
   * Derived events use the source row's date field directly.
   */
  date: string;

  /** Status as stored or derived. Derived events default to "upcoming". */
  status: CalendarEventStatus;

  /** Optional longer description. */
  description?: string;

  /**
   * Deterministic urgency calculated from the event date and today's date.
   * Never stored in the database.
   */
  urgency: CalendarEventUrgency;

  /** Number of days until (positive) or since (negative) the event date. */
  daysFromToday: number;

  /**
   * Where this event originated.
   * "db"        → came from the financial_calendar table directly
   * "policy"    → derived from insurance_policies.renewal_date
   * "goal"      → derived from financial_goals.target_date
   */
  source: "db" | "policy" | "goal";

  /**
   * Optional navigation URL to help the user take action.
   * Only set when a safe, meaningful route exists.
   */
  actionUrl?: string;

  /** Optional human-readable action label. */
  actionLabel?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// FinancialCalendarRow — raw row from the financial_calendar table
// ─────────────────────────────────────────────────────────────────────────────

export const financialCalendarRowSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  event_type: calendarEventTypeSchema,
  title: z.string(),
  description: z.string().nullable(),
  event_date: z.string(), // ISO date string (date column from Supabase)
  status: calendarEventStatusSchema,
  metadata: z.record(z.string(), z.unknown()).default({}),
  created_at: z.string(),
  updated_at: z.string(),
});

export type FinancialCalendarRow = z.infer<typeof financialCalendarRowSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// CalendarData — what the server action returns
// ─────────────────────────────────────────────────────────────────────────────

export interface CalendarData {
  events: CalendarEvent[];
}
