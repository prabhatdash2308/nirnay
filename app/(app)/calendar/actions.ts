"use server";

import { createClient } from "@supabase/supabase-js";
import { getFirebaseAdminAuth } from "../../lib/firebase-admin";
import type { CalendarData, FinancialCalendarRow } from "../../../lib/types/calendar";
import type { InsurancePolicy, FinancialGoal } from "../../../lib/types/portfolio";
import {
  buildEventsFromCalendarRows,
  buildEventsFromPolicies,
  buildEventsFromGoals,
  mergeAndSortEvents,
} from "../../../lib/calendar/calculations";

// ─────────────────────────────────────────────────────────────────────────────
// Authenticated Supabase client
//
// Uses the same pattern established in Phase 9:
//   global Authorization header (statically bound, bypasses async callback
//   issues in Next.js Server Actions) + accessToken callback.
// ─────────────────────────────────────────────────────────────────────────────

function buildSupabaseWithToken(firebaseIdToken: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Supabase configuration is missing.");
  }

  return createClient(supabaseUrl, supabasePublishableKey, {
    global: {
      headers: {
        Authorization: `Bearer ${firebaseIdToken}`,
      },
    },
    accessToken: async () => firebaseIdToken,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// loadCalendarData
//
// Authentication flow:
//   1. Client passes Firebase ID token (never a user_id).
//   2. Firebase Admin verifyIdToken() decodes and verifies the token.
//   3. We build a Supabase client carrying the Firebase JWT.
//   4. Supabase RLS evaluates auth.jwt() ->> 'sub' on every query.
//   5. Derived events are built from insurance_policies and financial_goals.
//   6. All sources are merged, deduplicated, and sorted.
//
// The function differentiates:
//   - Empty data: returns CalendarData with events: [] (successful empty state).
//   - Database failure: throws an Error (mapped to dataError in the UI layer).
// ─────────────────────────────────────────────────────────────────────────────

export async function loadCalendarData(
  firebaseIdToken: string
): Promise<CalendarData> {
  // 1. Verify token server-side. UID is never accepted from the client.
  const adminAuth = getFirebaseAdminAuth();
  await adminAuth.verifyIdToken(firebaseIdToken);

  const supabase = buildSupabaseWithToken(firebaseIdToken);

  // 2. Fetch in parallel: financial_calendar + insurance_policies + financial_goals.
  //    investments are NOT included because there is no reliable due-date field.
  const [calendarRes, policiesRes, goalsRes] = await Promise.all([
    supabase
      .from("financial_calendar")
      .select("*")
      .order("event_date", { ascending: true }),
    supabase
      .from("insurance_policies")
      .select("id, user_id, policy_type, provider, policy_name, policy_number, premium_amount, premium_frequency, sum_insured, start_date, renewal_date, status, metadata, created_at, updated_at")
      .order("renewal_date", { ascending: true }),
    supabase
      .from("financial_goals")
      .select("*")
      .order("target_date", { ascending: true }),
  ]);

  if (calendarRes.error) {
    console.error("[load-calendar] financial_calendar error:", calendarRes.error.message);
    throw new Error("Failed to load calendar events.");
  }
  if (policiesRes.error) {
    console.error("[load-calendar] insurance_policies error:", policiesRes.error.message);
    throw new Error("Failed to load insurance policies for calendar.");
  }
  if (goalsRes.error) {
    console.error("[load-calendar] financial_goals error:", goalsRes.error.message);
    throw new Error("Failed to load financial goals for calendar.");
  }

  // 3. Build and merge events from all sources.
  const today = new Date();

  const dbEvents = buildEventsFromCalendarRows(
    (calendarRes.data ?? []) as FinancialCalendarRow[],
    today
  );
  const policyEvents = buildEventsFromPolicies(
    (policiesRes.data ?? []) as InsurancePolicy[],
    today
  );
  const goalEvents = buildEventsFromGoals(
    (goalsRes.data ?? []) as FinancialGoal[],
    today
  );

  // DB events take priority (they come first to the deduplication set).
  const events = mergeAndSortEvents(dbEvents, policyEvents, goalEvents);

  return { events };
}
