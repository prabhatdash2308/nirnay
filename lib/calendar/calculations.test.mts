import { describe, it, expect } from "vitest";
import {
  calcDaysFromToday,
  calcUrgency,
  formatDaysLabel,
  buildEventsFromCalendarRows,
  buildEventsFromPolicies,
  buildEventsFromGoals,
  mergeAndSortEvents,
  calcCalendarSummary,
  filterNeedsAttention,
  UPCOMING_RENEWAL_DAYS,
  THIS_WEEK_DAYS,
} from "./calculations";
import type { FinancialCalendarRow } from "@/lib/types/calendar";
import type { InsurancePolicy, FinancialGoal } from "@/lib/types/portfolio";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Return a YYYY-MM-DD string that is `n` days from `base` (default: today). */
function dateOffsetStr(n: number, base: Date = new Date()): string {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

const TODAY = new Date();
const TODAY_STR = dateOffsetStr(0, TODAY);

// ─────────────────────────────────────────────────────────────────────────────
// calcDaysFromToday
// ─────────────────────────────────────────────────────────────────────────────

describe("calcDaysFromToday", () => {
  it("returns 0 for today", () => {
    expect(calcDaysFromToday(TODAY_STR, TODAY)).toBe(0);
  });

  it("returns positive number for a future date", () => {
    expect(calcDaysFromToday(dateOffsetStr(5, TODAY), TODAY)).toBe(5);
  });

  it("returns negative number for a past date", () => {
    expect(calcDaysFromToday(dateOffsetStr(-3, TODAY), TODAY)).toBe(-3);
  });

  it("handles 30 days in future", () => {
    expect(calcDaysFromToday(dateOffsetStr(30, TODAY), TODAY)).toBe(30);
  });

  it("handles 1 day in past", () => {
    expect(calcDaysFromToday(dateOffsetStr(-1, TODAY), TODAY)).toBe(-1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// calcUrgency
// ─────────────────────────────────────────────────────────────────────────────

describe("calcUrgency", () => {
  it("is overdue for negative days", () => {
    expect(calcUrgency(-1)).toBe("overdue");
    expect(calcUrgency(-100)).toBe("overdue");
  });

  it("is today for 0 days", () => {
    expect(calcUrgency(0)).toBe("today");
  });

  it("is this_week for 1–7 days", () => {
    expect(calcUrgency(1)).toBe("this_week");
    expect(calcUrgency(THIS_WEEK_DAYS)).toBe("this_week");
  });

  it("is this_month for 8–30 days", () => {
    expect(calcUrgency(8)).toBe("this_month");
    expect(calcUrgency(UPCOMING_RENEWAL_DAYS)).toBe("this_month");
  });

  it("is upcoming for >30 days", () => {
    expect(calcUrgency(31)).toBe("upcoming");
    expect(calcUrgency(365)).toBe("upcoming");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// formatDaysLabel
// ─────────────────────────────────────────────────────────────────────────────

describe("formatDaysLabel", () => {
  it("formats overdue correctly for 1 day", () => {
    expect(formatDaysLabel(-1)).toBe("Overdue by 1 day");
  });

  it("formats overdue correctly for multiple days", () => {
    expect(formatDaysLabel(-5)).toBe("Overdue by 5 days");
  });

  it("formats today", () => {
    expect(formatDaysLabel(0)).toBe("Due today");
  });

  it("formats 1 day ahead", () => {
    expect(formatDaysLabel(1)).toBe("In 1 day");
  });

  it("formats multiple days ahead", () => {
    expect(formatDaysLabel(12)).toBe("In 12 days");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildEventsFromCalendarRows
// ─────────────────────────────────────────────────────────────────────────────

describe("buildEventsFromCalendarRows", () => {
  const baseRow: FinancialCalendarRow = {
    id: 1,
    user_id: "user1",
    event_type: "insurance_renewal",
    title: "Health Policy",
    description: null,
    event_date: dateOffsetStr(10, TODAY),
    status: "upcoming",
    metadata: {},
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  };

  it("builds an event from a valid row", () => {
    const events = buildEventsFromCalendarRows([baseRow], TODAY);
    expect(events).toHaveLength(1);
    expect(events[0].id).toBe("db-1");
    expect(events[0].source).toBe("db");
    expect(events[0].title).toBe("Health Policy");
    expect(events[0].urgency).toBe("this_month");
  });

  it("filters out cancelled rows", () => {
    const row: FinancialCalendarRow = { ...baseRow, status: "cancelled" };
    expect(buildEventsFromCalendarRows([row], TODAY)).toHaveLength(0);
  });

  it("filters out skipped rows", () => {
    const row: FinancialCalendarRow = { ...baseRow, status: "skipped" };
    expect(buildEventsFromCalendarRows([row], TODAY)).toHaveLength(0);
  });

  it("includes completed rows", () => {
    const row: FinancialCalendarRow = { ...baseRow, status: "completed" };
    expect(buildEventsFromCalendarRows([row], TODAY)).toHaveLength(1);
  });

  it("returns empty array for empty input", () => {
    expect(buildEventsFromCalendarRows([], TODAY)).toHaveLength(0);
  });

  it("marks an overdue row correctly", () => {
    const row: FinancialCalendarRow = {
      ...baseRow,
      event_date: dateOffsetStr(-5, TODAY),
    };
    const [event] = buildEventsFromCalendarRows([row], TODAY);
    expect(event.urgency).toBe("overdue");
    expect(event.daysFromToday).toBe(-5);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildEventsFromPolicies
// ─────────────────────────────────────────────────────────────────────────────

const basePolicy: InsurancePolicy = {
  id: 101,
  user_id: "user1",
  policy_type: "health",
  provider: "HDFC",
  policy_name: "Optima Secure",
  policy_number: "POL-001",
  premium_amount: 10000,
  premium_frequency: "yearly",
  sum_insured: 500000,
  start_date: "2025-01-01",
  renewal_date: null,
  status: "active",
  metadata: {},
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
};

describe("buildEventsFromPolicies", () => {
  it("ignores policies with null renewal_date", () => {
    const events = buildEventsFromPolicies([basePolicy], TODAY);
    expect(events).toHaveLength(0);
  });

  it("ignores non-active policies", () => {
    const policy: InsurancePolicy = {
      ...basePolicy,
      renewal_date: dateOffsetStr(10, TODAY),
      status: "expired",
    };
    expect(buildEventsFromPolicies([policy], TODAY)).toHaveLength(0);
  });

  it("builds a renewal event for active policy with renewal_date", () => {
    const renewalDate = dateOffsetStr(12, TODAY);
    const policy: InsurancePolicy = { ...basePolicy, renewal_date: renewalDate };
    const events = buildEventsFromPolicies([policy], TODAY);
    expect(events).toHaveLength(1);
    expect(events[0].id).toBe("policy-renewal-101");
    expect(events[0].type).toBe("insurance_renewal");
    expect(events[0].source).toBe("policy");
    expect(events[0].date).toBe(renewalDate);
    expect(events[0].urgency).toBe("this_month");
    expect(events[0].actionUrl).toBe("/discover");
  });

  it("marks overdue renewal correctly", () => {
    const policy: InsurancePolicy = {
      ...basePolicy,
      renewal_date: dateOffsetStr(-3, TODAY),
    };
    const [event] = buildEventsFromPolicies([policy], TODAY);
    expect(event.urgency).toBe("overdue");
    expect(event.daysFromToday).toBe(-3);
  });

  it("marks due-today renewal correctly", () => {
    const policy: InsurancePolicy = {
      ...basePolicy,
      renewal_date: TODAY_STR,
    };
    const [event] = buildEventsFromPolicies([policy], TODAY);
    expect(event.urgency).toBe("today");
    expect(event.daysFromToday).toBe(0);
  });

  it("returns empty for empty input", () => {
    expect(buildEventsFromPolicies([], TODAY)).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// buildEventsFromGoals
// ─────────────────────────────────────────────────────────────────────────────

const baseGoal: FinancialGoal = {
  id: 201,
  user_id: "user1",
  name: "Emergency Fund",
  goal_type: "emergency_fund",
  target_amount: 100000,
  current_amount: 50000,
  target_date: null,
  priority: "high",
  status: "active",
  metadata: {},
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
};

describe("buildEventsFromGoals", () => {
  it("ignores goals with null target_date", () => {
    expect(buildEventsFromGoals([baseGoal], TODAY)).toHaveLength(0);
  });

  it("ignores non-active goals", () => {
    const goal: FinancialGoal = {
      ...baseGoal,
      target_date: dateOffsetStr(20, TODAY),
      status: "completed",
    };
    expect(buildEventsFromGoals([goal], TODAY)).toHaveLength(0);
  });

  it("builds an event for active goal with target_date", () => {
    const targetDate = dateOffsetStr(20, TODAY);
    const goal: FinancialGoal = { ...baseGoal, target_date: targetDate };
    const events = buildEventsFromGoals([goal], TODAY);
    expect(events).toHaveLength(1);
    expect(events[0].id).toBe("goal-milestone-201");
    expect(events[0].type).toBe("goal_milestone");
    expect(events[0].source).toBe("goal");
    expect(events[0].date).toBe(targetDate);
  });

  it("returns empty for empty input", () => {
    expect(buildEventsFromGoals([], TODAY)).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// mergeAndSortEvents
// ─────────────────────────────────────────────────────────────────────────────

describe("mergeAndSortEvents", () => {
  it("deduplicates by id — db events win over derived events with same id", () => {
    const policyEvents = buildEventsFromPolicies(
      [{ ...basePolicy, renewal_date: dateOffsetStr(5, TODAY) }],
      TODAY
    );
    // Add a second identical event to simulate duplicate
    const duplicate = { ...policyEvents[0] };
    const merged = mergeAndSortEvents(policyEvents, [duplicate]);
    expect(merged).toHaveLength(1);
  });

  it("sorts overdue events before upcoming events", () => {
    const overdueDate = dateOffsetStr(-2, TODAY);
    const futureDate = dateOffsetStr(10, TODAY);

    const policy1: InsurancePolicy = { ...basePolicy, id: 1, renewal_date: futureDate };
    const policy2: InsurancePolicy = { ...basePolicy, id: 2, renewal_date: overdueDate };
    const events = mergeAndSortEvents(
      buildEventsFromPolicies([policy1, policy2], TODAY)
    );

    expect(events[0].urgency).toBe("overdue");
    expect(events[1].urgency).toBe("this_month");
  });

  it("handles empty inputs", () => {
    expect(mergeAndSortEvents([], [], [])).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// calcCalendarSummary
// ─────────────────────────────────────────────────────────────────────────────

describe("calcCalendarSummary", () => {
  it("returns zeros for empty events", () => {
    const summary = calcCalendarSummary([]);
    expect(summary.overdueCount).toBe(0);
    expect(summary.todayCount).toBe(0);
    expect(summary.needsAttentionCount).toBe(0);
  });

  it("counts correctly across urgency groups", () => {
    const policies: InsurancePolicy[] = [
      { ...basePolicy, id: 1, renewal_date: dateOffsetStr(-1, TODAY) }, // overdue
      { ...basePolicy, id: 2, renewal_date: TODAY_STR }, // today
      { ...basePolicy, id: 3, renewal_date: dateOffsetStr(5, TODAY) }, // this_week
      { ...basePolicy, id: 4, renewal_date: dateOffsetStr(20, TODAY) }, // this_month
      { ...basePolicy, id: 5, renewal_date: dateOffsetStr(60, TODAY) }, // upcoming
    ];
    const events = buildEventsFromPolicies(policies, TODAY);
    const summary = calcCalendarSummary(events);
    expect(summary.overdueCount).toBe(1);
    expect(summary.todayCount).toBe(1);
    expect(summary.thisWeekCount).toBe(1);
    expect(summary.thisMonthCount).toBe(1);
    expect(summary.totalUpcoming).toBe(1);
    expect(summary.needsAttentionCount).toBe(3); // overdue + today + this_week
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// filterNeedsAttention
// ─────────────────────────────────────────────────────────────────────────────

describe("filterNeedsAttention", () => {
  it("returns only overdue, today, this_week events", () => {
    const policies: InsurancePolicy[] = [
      { ...basePolicy, id: 1, renewal_date: dateOffsetStr(-5, TODAY) }, // overdue
      { ...basePolicy, id: 2, renewal_date: TODAY_STR }, // today
      { ...basePolicy, id: 3, renewal_date: dateOffsetStr(3, TODAY) }, // this_week
      { ...basePolicy, id: 4, renewal_date: dateOffsetStr(15, TODAY) }, // this_month
    ];
    const events = buildEventsFromPolicies(policies, TODAY);
    const attention = filterNeedsAttention(events);
    expect(attention).toHaveLength(3);
    expect(attention.every((e) => e.urgency !== "this_month" && e.urgency !== "upcoming")).toBe(true);
  });

  it("returns empty when no events need attention", () => {
    const policies: InsurancePolicy[] = [
      { ...basePolicy, id: 1, renewal_date: dateOffsetStr(31, TODAY) },
    ];
    const events = buildEventsFromPolicies(policies, TODAY);
    expect(filterNeedsAttention(events)).toHaveLength(0);
  });
});
