/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

// Mock Firebase Admin
vi.mock("../../lib/firebase-admin", () => ({
  getFirebaseAdminAuth: vi.fn(),
}));

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

import { loadPortfolioData } from "./actions";
import { getFirebaseAdminAuth } from "../../lib/firebase-admin";
import { createClient } from "@supabase/supabase-js";

describe("Portfolio Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "anon_key";

    const mockVerifyIdToken = vi.fn().mockResolvedValue({ uid: "user123" });
    (getFirebaseAdminAuth as any).mockReturnValue({
      verifyIdToken: mockVerifyIdToken,
    });

    mockSupabaseSelect.mockReturnValue({
      order: mockSupabaseOrder,
    });
    mockSupabaseOrder.mockResolvedValue({ data: [], error: null });
  });

  it("loadPortfolioData authenticates and fetches 3 tables", async () => {
    const data = await loadPortfolioData("valid_token");
    
    expect(getFirebaseAdminAuth().verifyIdToken).toHaveBeenCalledWith("valid_token");
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("insurance_policies");
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("investments");
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("financial_goals");
    
    expect(data.policies).toEqual([]);
    expect(data.investments).toEqual([]);
    expect(data.goals).toEqual([]);
  });

  it("throws if a table fetch fails", async () => {
    mockSupabaseOrder.mockResolvedValueOnce({ data: null, error: { message: "DB Error" } });
    await expect(loadPortfolioData("valid_token")).rejects.toThrow("Failed to load insurance policies.");
  });
});
