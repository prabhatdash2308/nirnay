/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock server-only
vi.mock("server-only", () => ({}));

// Mock Firebase Admin
vi.mock("../../app/lib/firebase-admin", () => ({
  getFirebaseAdminAuth: vi.fn(),
}));

// Mock Profile
vi.mock("../../app/(app)/settings/financial-profile/actions", () => ({
  loadFinancialProfile: vi.fn(),
}));

// Mock Catalogue
vi.mock("../../lib/catalogue/products", () => ({
  getProductById: vi.fn(),
}));

// Mock Decision Logic
vi.mock("../../lib/decide/logic", () => ({
  generateDecisionGuidance: vi.fn(),
}));

// Mock Supabase
const mockSupabaseSelect = vi.fn();
const mockSupabaseInsert = vi.fn();
const mockSupabaseUpsert = vi.fn();
const mockSupabaseEq = vi.fn();
const mockSupabaseOrder = vi.fn();
const mockSupabaseSingle = vi.fn();
const mockSupabaseMaybeSingle = vi.fn();

const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: mockSupabaseSelect,
    insert: mockSupabaseInsert,
    upsert: mockSupabaseUpsert,
  })),
};

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}));

import { saveDecision, loadSavedDecisions, loadDecisionById } from "../../app/(app)/decide/actions";
import { getFirebaseAdminAuth } from "../../app/lib/firebase-admin";
import { loadFinancialProfile } from "../../app/(app)/settings/financial-profile/actions";
import { getProductById } from "../../lib/catalogue/products";
import { generateDecisionGuidance } from "../../lib/decide/logic";
import { createClient } from "@supabase/supabase-js";

describe("Decide Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Set up standard environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "anon_key";

    // Standard mock implementations
    const mockVerifyIdToken = vi.fn().mockResolvedValue({ uid: "test_user_123" });
    (getFirebaseAdminAuth as any).mockReturnValue({
      verifyIdToken: mockVerifyIdToken,
    });

    (loadFinancialProfile as any).mockResolvedValue({ risk_profile: "moderate" });
    
    (getProductById as any).mockReturnValue({
      id: "p1",
      name: "Test Product",
      type: "insurance",
      provider: "Test Provider",
      tagline: "Test Tagline",
    });

    (generateDecisionGuidance as any).mockReturnValue({
      strongestMatch: {
        suitability: { hasProfile: true, score: 85 },
        whyMatches: ["Reason 1"],
        cautions: ["Caution 1"],
      },
      otherProducts: [],
      generalCautions: ["Gen Caution 1"],
    });

    // Supabase chaining mocks
    mockSupabaseSelect.mockReturnValue({
      eq: mockSupabaseEq,
      order: mockSupabaseOrder,
    });
    mockSupabaseUpsert.mockReturnValue({
      select: vi.fn().mockReturnValue({ single: mockSupabaseSingle }),
    });
    mockSupabaseEq.mockReturnValue({
      maybeSingle: mockSupabaseMaybeSingle,
    });
    
    mockSupabaseSingle.mockResolvedValue({ data: { id: 1, status: "saved" }, error: null });
    mockSupabaseOrder.mockResolvedValue({ data: [{ id: 1 }], error: null });
    mockSupabaseMaybeSingle.mockResolvedValue({ data: { id: 1 }, error: null });
  });

  it("1. saveDecision authenticates and securely reconstructs decision server-side", async () => {
    const result = await saveDecision("valid_token", "p1");
    
    // Verify Firebase
    expect(getFirebaseAdminAuth().verifyIdToken).toHaveBeenCalledWith("valid_token");
    
    // Verify Profile loaded
    expect(loadFinancialProfile).toHaveBeenCalledWith("valid_token");
    
    // Verify Product loaded server-side
    expect(getProductById).toHaveBeenCalledWith("p1");
    
    // Verify Logic Recomputed
    expect(generateDecisionGuidance).toHaveBeenCalled();
    
    // Verify DB Upsert payload mapping
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("decision_records");
    expect(mockSupabaseUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "test_user_123", // extracted from token, NOT passed by client
        product_id: "p1",
        suitability_score: 85,
        decision_context: expect.objectContaining({
          productName: "Test Product",
          whyItMatches: ["Reason 1"],
        }),
      }),
      { onConflict: "user_id, product_id" }
    );
    
    expect(result.id).toBe(1);
  });

  it("2. saveDecision throws if invalid product", async () => {
    (getProductById as any).mockReturnValue(undefined);
    await expect(saveDecision("valid_token", "invalid_p")).rejects.toThrow("Invalid product ID.");
  });

  it("3. loadSavedDecisions authenticates and fetches user records", async () => {
    const result = await loadSavedDecisions("valid_token");
    expect(getFirebaseAdminAuth().verifyIdToken).toHaveBeenCalledWith("valid_token");
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("decision_records");
    expect(mockSupabaseSelect).toHaveBeenCalledWith("*");
    expect(result.length).toBe(1);
  });

  it("4. loadDecisionById authenticates and fetches single record", async () => {
    const result = await loadDecisionById("valid_token", 1);
    expect(getFirebaseAdminAuth().verifyIdToken).toHaveBeenCalledWith("valid_token");
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("decision_records");
    expect(mockSupabaseEq).toHaveBeenCalledWith("id", 1);
    expect(result?.id).toBe(1);
  });
});
