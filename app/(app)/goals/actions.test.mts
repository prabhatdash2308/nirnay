import { describe, it, expect, vi, beforeEach } from "vitest";
import { loadGoalsData } from "./actions";
import { getFirebaseAdminAuth } from "../../lib/firebase-admin";

vi.mock("@supabase/supabase-js", () => {
  return {
    createClient: vi.fn(() => ({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn().mockResolvedValue({
            data: [{ id: 1, name: "Test Goal" }],
            error: null,
          }),
        })),
      })),
    })),
  };
});

vi.mock("../../lib/firebase-admin", () => ({
  getFirebaseAdminAuth: vi.fn(),
}));

describe("Goals Actions", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "test-key";
  });

  it("loads goals data successfully", async () => {
    const mockVerifyIdToken = vi.fn().mockResolvedValue({
      uid: "user123",
      role: "premium",
    });

    vi.mocked(getFirebaseAdminAuth).mockReturnValue({
      verifyIdToken: mockVerifyIdToken,
    } as unknown as ReturnType<typeof getFirebaseAdminAuth>);

    const goals = await loadGoalsData("fake-token");

    expect(mockVerifyIdToken).toHaveBeenCalledWith("fake-token");
    expect(goals).toHaveLength(1);
    expect(goals[0].name).toBe("Test Goal");
  });

  it("throws error if supabase config is missing", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;

    const mockVerifyIdToken = vi.fn().mockResolvedValue({ uid: "user123" });
    vi.mocked(getFirebaseAdminAuth).mockReturnValue({
      verifyIdToken: mockVerifyIdToken,
    } as unknown as ReturnType<typeof getFirebaseAdminAuth>);

    await expect(loadGoalsData("fake-token")).rejects.toThrow(
      "Supabase configuration is missing."
    );
  });
});
