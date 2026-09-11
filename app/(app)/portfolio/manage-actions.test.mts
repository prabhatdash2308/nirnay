/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("../../lib/firebase-admin", () => ({
  getFirebaseAdminAuth: vi.fn(),
}));

const mockSelect = vi.fn();
const mockSingle = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();

// We use a fluent builder pattern so each call returns an object with the next method
const mockBuilder = {
  insert: mockInsert,
  update: mockUpdate,
  delete: mockDelete,
  select: mockSelect,
  single: mockSingle,
  eq: mockEq,
};

// Make builder methods return themselves for chaining
mockInsert.mockReturnValue(mockBuilder);
mockUpdate.mockReturnValue(mockBuilder);
mockDelete.mockReturnValue({ ...mockBuilder, eq: mockEq });
mockSelect.mockReturnValue(mockBuilder);
// For delete chains: each eq call must return something with both eq and error
mockEq.mockImplementation(() => ({ ...mockBuilder, eq: mockEq, error: null }));
mockSingle.mockResolvedValue({ data: { id: 99 }, error: null });

const mockSupabaseClient = {
  from: vi.fn(() => mockBuilder),
};

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => mockSupabaseClient),
}));

import {
  addInsurancePolicy,
  updateInsurancePolicy,
  deleteInsurancePolicy,
  addInvestment,
  updateInvestment,
  deleteInvestment,
  addFinancialGoal,
  updateFinancialGoal,
  deleteFinancialGoal,
} from "./manage-actions";

import {
  addPolicyInputSchema,
  addInvestmentInputSchema,
  addGoalInputSchema,
} from "../../../lib/portfolio/schemas";

import { getFirebaseAdminAuth } from "../../lib/firebase-admin";

const MOCK_TOKEN = "firebase_id_token";
const MOCK_UID = "user-abc-123";

function setupAuth() {
  (getFirebaseAdminAuth as any).mockReturnValue({
    verifyIdToken: vi.fn().mockResolvedValue({ uid: MOCK_UID }),
  });
}

describe("Manage Actions — Schema Validation", () => {
  describe("addPolicyInputSchema", () => {
    it("accepts a valid policy", () => {
      const result = addPolicyInputSchema.safeParse({
        policy_type: "health",
        provider: "HDFC ERGO",
        policy_name: "Family Health",
        status: "active",
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing required fields", () => {
      const result = addPolicyInputSchema.safeParse({
        policy_type: "health",
      });
      expect(result.success).toBe(false);
    });

    it("rejects negative premium_amount", () => {
      const result = addPolicyInputSchema.safeParse({
        policy_type: "health",
        provider: "Test",
        policy_name: "Test",
        premium_amount: -100,
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid policy_type enum", () => {
      const result = addPolicyInputSchema.safeParse({
        policy_type: "dental",
        provider: "Test",
        policy_name: "Test",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("addInvestmentInputSchema", () => {
    it("accepts a valid investment", () => {
      const result = addInvestmentInputSchema.safeParse({
        investment_type: "sip",
        scheme_name: "SBI Bluechip",
        status: "active",
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing scheme_name", () => {
      const result = addInvestmentInputSchema.safeParse({
        investment_type: "sip",
      });
      expect(result.success).toBe(false);
    });

    it("rejects negative amount", () => {
      const result = addInvestmentInputSchema.safeParse({
        investment_type: "sip",
        scheme_name: "Test",
        amount: -500,
      });
      expect(result.success).toBe(false);
    });

    it("does not accept current_value (not in schema)", () => {
      // current_value is not a field in investments; Zod will strip it
      const result = addInvestmentInputSchema.safeParse({
        investment_type: "mutual_fund",
        scheme_name: "Test Fund",
        current_value: 99999, // this field should not exist
      });
      // Parsing still succeeds (extra keys are stripped), but the key is absent
      expect(result.success).toBe(true);
      if (result.success) {
        expect("current_value" in result.data).toBe(false);
      }
    });
  });

  describe("addGoalInputSchema", () => {
    it("accepts a valid goal", () => {
      const result = addGoalInputSchema.safeParse({
        name: "Emergency Fund",
        goal_type: "emergency_fund",
        target_amount: 100000,
        current_amount: 0,
        priority: "high",
        status: "active",
      });
      expect(result.success).toBe(true);
    });

    it("rejects target_amount of 0 or negative", () => {
      const zeroResult = addGoalInputSchema.safeParse({
        name: "Test",
        goal_type: "custom",
        target_amount: 0,
        current_amount: 0,
      });
      expect(zeroResult.success).toBe(false);

      const negResult = addGoalInputSchema.safeParse({
        name: "Test",
        goal_type: "custom",
        target_amount: -1000,
        current_amount: 0,
      });
      expect(negResult.success).toBe(false);
    });

    it("rejects negative current_amount", () => {
      const result = addGoalInputSchema.safeParse({
        name: "Test",
        goal_type: "custom",
        target_amount: 10000,
        current_amount: -500,
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("Manage Actions — Server CRUD", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "anon_key";
    setupAuth();
    // Reset chained builder
    mockInsert.mockReturnValue(mockBuilder);
    mockUpdate.mockReturnValue(mockBuilder);
    mockDelete.mockReturnValue(mockBuilder);
    mockSelect.mockReturnValue(mockBuilder);
    mockEq.mockReturnValue(mockBuilder);
    mockSingle.mockResolvedValue({ data: { id: 99 }, error: null });
  });

  it("addInsurancePolicy: verifies token, sets user_id from token", async () => {
    const result = await addInsurancePolicy(MOCK_TOKEN, {
      policy_type: "health",
      provider: "HDFC ERGO",
      policy_name: "Family Health",
      status: "active",
    });
    expect(getFirebaseAdminAuth().verifyIdToken).toHaveBeenCalledWith(MOCK_TOKEN);
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("insurance_policies");
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: MOCK_UID })
    );
    expect(result).toEqual({ id: 99 });
  });

  it("updateInsurancePolicy: includes user_id eq filter", async () => {
    await updateInsurancePolicy(MOCK_TOKEN, 5, {
      policy_type: "motor",
      provider: "Bajaj",
      policy_name: "Motor Plan",
      status: "active",
    });
    expect(mockEq).toHaveBeenCalledWith("user_id", MOCK_UID);
    expect(mockEq).toHaveBeenCalledWith("id", 5);
  });

  it("deleteInsurancePolicy: calls delete and filters by user_id", async () => {
    mockEq.mockImplementation(() => ({ ...mockBuilder, eq: mockEq, error: null }));
    await deleteInsurancePolicy(MOCK_TOKEN, 3);
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("user_id", MOCK_UID);
  });

  it("addInvestment: verifies token, sets user_id from token", async () => {
    await addInvestment(MOCK_TOKEN, {
      investment_type: "sip",
      scheme_name: "SBI Bluechip",
      status: "active",
    });
    expect(getFirebaseAdminAuth().verifyIdToken).toHaveBeenCalledWith(MOCK_TOKEN);
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: MOCK_UID })
    );
  });

  it("addFinancialGoal: verifies token, sets user_id from token", async () => {
    await addFinancialGoal(MOCK_TOKEN, {
      name: "Emergency Fund",
      goal_type: "emergency_fund",
      target_amount: 100000,
      current_amount: 5000,
      priority: "high",
      status: "active",
    });
    expect(getFirebaseAdminAuth().verifyIdToken).toHaveBeenCalledWith(MOCK_TOKEN);
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ user_id: MOCK_UID })
    );
  });

  it("throws if Supabase returns an error", async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { message: "DB Error" } });
    await expect(
      addInsurancePolicy(MOCK_TOKEN, {
        policy_type: "health",
        provider: "Test",
        policy_name: "Test",
        status: "active",
      })
    ).rejects.toThrow("Failed to save insurance policy.");
  });

  it("updateFinancialGoal: includes user_id eq filter", async () => {
    await updateFinancialGoal(MOCK_TOKEN, 7, {
      name: "Retirement",
      goal_type: "retirement",
      target_amount: 5000000,
      current_amount: 100000,
      priority: "high",
      status: "active",
    });
    expect(mockEq).toHaveBeenCalledWith("user_id", MOCK_UID);
    expect(mockEq).toHaveBeenCalledWith("id", 7);
  });

  it("deleteFinancialGoal: calls delete and filters by user_id", async () => {
    mockEq.mockImplementation(() => ({ ...mockBuilder, eq: mockEq, error: null }));
    await deleteFinancialGoal(MOCK_TOKEN, 8);
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("user_id", MOCK_UID);
  });

  it("updateInvestment: includes user_id eq filter", async () => {
    await updateInvestment(MOCK_TOKEN, 12, {
      investment_type: "fd",
      scheme_name: "SBI FD",
      status: "completed",
    });
    expect(mockEq).toHaveBeenCalledWith("user_id", MOCK_UID);
    expect(mockEq).toHaveBeenCalledWith("id", 12);
  });

  it("deleteInvestment: calls delete and filters by user_id", async () => {
    mockEq.mockImplementation(() => ({ ...mockBuilder, eq: mockEq, error: null }));
    await deleteInvestment(MOCK_TOKEN, 20);
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("user_id", MOCK_UID);
  });
});
