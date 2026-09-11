/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

// Mock Firebase Admin
vi.mock("../../lib/firebase-admin", () => ({
  getFirebaseAdminAuth: vi.fn(),
}));

// Mock Supabase client
const mockSupabaseSelect = vi.fn();
const mockSupabaseOrder = vi.fn();

const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: mockSupabaseSelect,
  })),
};

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}));

import { loadCalendarData } from "./actions";
import { getFirebaseAdminAuth } from "../../lib/firebase-admin";

describe("Calendar Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "anon_key";

    const mockVerifyIdToken = vi.fn().mockResolvedValue({ uid: "user123" });
    (getFirebaseAdminAuth as any).mockReturnValue({
      verifyIdToken: mockVerifyIdToken,
    });

    // Default: all queries return empty arrays successfully
    mockSupabaseSelect.mockReturnValue({
      order: mockSupabaseOrder,
    });
    mockSupabaseOrder.mockResolvedValue({ data: [], error: null });
  });

  // ─── Authentication ───────────────────────────────────────────────────────

  it("calls verifyIdToken with the provided token", async () => {
    await loadCalendarData("valid_token");
    expect(getFirebaseAdminAuth().verifyIdToken).toHaveBeenCalledWith("valid_token");
  });

  it("queries financial_calendar, insurance_policies, and financial_goals", async () => {
    await loadCalendarData("valid_token");
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("financial_calendar");
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("insurance_policies");
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("financial_goals");
  });

  // ─── Empty state ──────────────────────────────────────────────────────────

  it("returns empty events array for authenticated user with no data", async () => {
    const data = await loadCalendarData("valid_token");
    expect(data.events).toEqual([]);
  });

  // ─── Error propagation ────────────────────────────────────────────────────

  it("throws if financial_calendar query fails", async () => {
    mockSupabaseOrder.mockResolvedValueOnce({
      data: null,
      error: { message: "DB Error" },
    });
    await expect(loadCalendarData("valid_token")).rejects.toThrow(
      "Failed to load calendar events."
    );
  });

  it("throws if insurance_policies query fails", async () => {
    // First call (financial_calendar) succeeds
    mockSupabaseOrder.mockResolvedValueOnce({ data: [], error: null });
    // Second call (insurance_policies) fails
    mockSupabaseOrder.mockResolvedValueOnce({
      data: null,
      error: { message: "DB Error" },
    });
    await expect(loadCalendarData("valid_token")).rejects.toThrow(
      "Failed to load insurance policies for calendar."
    );
  });

  it("throws if financial_goals query fails", async () => {
    // First two calls succeed
    mockSupabaseOrder.mockResolvedValueOnce({ data: [], error: null });
    mockSupabaseOrder.mockResolvedValueOnce({ data: [], error: null });
    // Third call (financial_goals) fails
    mockSupabaseOrder.mockResolvedValueOnce({
      data: null,
      error: { message: "DB Error" },
    });
    await expect(loadCalendarData("valid_token")).rejects.toThrow(
      "Failed to load financial goals for calendar."
    );
  });

  it("throws if verifyIdToken fails", async () => {
    (getFirebaseAdminAuth as any).mockReturnValue({
      verifyIdToken: vi.fn().mockRejectedValue(new Error("Invalid token")),
    });
    await expect(loadCalendarData("bad_token")).rejects.toThrow("Invalid token");
  });

  // ─── UID ownership ────────────────────────────────────────────────────────

  it("does NOT accept a user_id from the client — UID only via verifyIdToken", async () => {
    // Confirm no 'user_id' param is passed to supabase from the action —
    // ownership is enforced by RLS (auth.jwt() ->> 'sub'), not by explicit
    // eq() filter in this action. We verify that the action calls verifyIdToken.
    await loadCalendarData("valid_token");
    expect(getFirebaseAdminAuth().verifyIdToken).toHaveBeenCalledTimes(1);
  });

  // ─── Data returned ────────────────────────────────────────────────────────

  it("builds events from returned policy data with a renewal_date", async () => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 10);
    const futureDateStr = futureDate.toISOString().split("T")[0];

    mockSupabaseOrder
      // financial_calendar — empty
      .mockResolvedValueOnce({ data: [], error: null })
      // insurance_policies — 1 active policy with renewal date
      .mockResolvedValueOnce({
        data: [
          {
            id: 1,
            user_id: "user123",
            policy_type: "health",
            provider: "HDFC",
            policy_name: "Optima Secure",
            renewal_date: futureDateStr,
            status: "active",
          },
        ],
        error: null,
      })
      // financial_goals — empty
      .mockResolvedValueOnce({ data: [], error: null });

    const result = await loadCalendarData("valid_token");
    expect(result.events).toHaveLength(1);
    expect(result.events[0].id).toBe("policy-renewal-1");
    expect(result.events[0].type).toBe("insurance_renewal");
    expect(result.events[0].source).toBe("policy");
  });

  it("does not build events from policies missing renewal_date", async () => {
    mockSupabaseOrder
      .mockResolvedValueOnce({ data: [], error: null })
      .mockResolvedValueOnce({
        data: [
          {
            id: 2,
            user_id: "user123",
            policy_type: "health",
            provider: "HDFC",
            policy_name: "Optima Secure",
            renewal_date: null,
            status: "active",
          },
        ],
        error: null,
      })
      .mockResolvedValueOnce({ data: [], error: null });

    const result = await loadCalendarData("valid_token");
    expect(result.events).toHaveLength(0);
  });
});
