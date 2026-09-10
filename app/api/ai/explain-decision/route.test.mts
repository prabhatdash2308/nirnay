/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("server-only", () => ({}));

import { POST } from "./route";

// Mock the dependencies
vi.mock("../../../../lib/ai/client", () => {
  return {
    aiClient: {
      getGenerativeModel: vi.fn(),
    },
    ExplanationSchema: {},
  };
});

vi.mock("../../../../app/(app)/settings/financial-profile/actions", () => ({
  loadFinancialProfile: vi.fn(),
}));

vi.mock("../../../../lib/compare/utils", () => ({
  resolveCompareProducts: vi.fn(),
}));

vi.mock("../../../../lib/decide/logic", () => ({
  generateDecisionGuidance: vi.fn(),
}));

import { aiClient } from "../../../../lib/ai/client";
import { loadFinancialProfile } from "../../../../app/(app)/settings/financial-profile/actions";
import { resolveCompareProducts } from "../../../../lib/compare/utils";
import { generateDecisionGuidance } from "../../../../lib/decide/logic";

describe("AI Explanation API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createRequest = (body: any, auth: string | null = null) => {
    return new NextRequest("http://localhost/api/ai/explain-decision", {
      method: "POST",
      headers: auth ? { authorization: `Bearer ${auth}` } : {},
      body: JSON.stringify(body),
    });
  };

  const setupMocks = ({
    mockProfile = null as any,
    mockProducts = [{ id: "p1", name: "Product 1", type: "insurance", subcategory: "health", keyFeatures: [], cost: {}, importantConsiderations: [], provenance: { source: { name: "Test" }, status: "reference" } }],
    mockDecision = { strongestMatch: { product: { id: "p1" } }, hasTie: false, whyMatches: ["Reason"], cautions: ["Caution"], generalCautions: ["GenCaution"] },
    mockAiResponse = JSON.stringify({
      summary: "AI Summary",
      whyItMatches: ["AI Match"],
      whatToConsider: ["AI Consider"],
      questionsToAsk: ["AI Question"],
    }),
    throwAiError = false,
  }) => {
    (loadFinancialProfile as any).mockResolvedValue(mockProfile);
    (resolveCompareProducts as any).mockReturnValue(mockProducts);
    (generateDecisionGuidance as any).mockReturnValue(mockDecision);

    if (throwAiError) {
      (aiClient!.getGenerativeModel as any).mockReturnValue({
        generateContent: vi.fn().mockRejectedValue(new Error("AI Provider Error")),
      });
    } else {
      (aiClient!.getGenerativeModel as any).mockReturnValue({
        generateContent: vi.fn().mockResolvedValue({
          response: { text: () => mockAiResponse },
        }),
      });
    }
  };

  it("1. Valid AI response", async () => {
    setupMocks({});
    const req = createRequest({ productIds: ["p1"] });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.summary).toBe("AI Summary");
  });

  it("2. Malformed response", async () => {
    setupMocks({ mockAiResponse: "Not JSON" });
    const req = createRequest({ productIds: ["p1"] });
    const res = await POST(req);
    expect(res.status).toBe(500); // Because JSON.parse fails, caught by outer try-catch
  });

  it("4. Empty response", async () => {
    setupMocks({ mockAiResponse: "" });
    const req = createRequest({ productIds: ["p1"] });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  it("5. Provider error", async () => {
    setupMocks({ throwAiError: true });
    const req = createRequest({ productIds: ["p1"] });
    const res = await POST(req);
    expect(res.status).toBe(502);
    const data = await res.json();
    expect(data.error).toBe("AI explanation is temporarily unavailable.");
  });

  it("8. No profile", async () => {
    setupMocks({ mockProfile: null });
    const req = createRequest({ productIds: ["p1"] });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("9. No products", async () => {
    setupMocks({ mockProducts: [] });
    const req = createRequest({ productIds: [] });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid product IDs");
  });

  it("10. One product", async () => {
    setupMocks({ mockProducts: [{ id: "p1", provenance: { source: { name: "test" } } }] as any });
    const req = createRequest({ productIds: ["p1"] });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("11. Multiple products", async () => {
    setupMocks({ mockProducts: [{ id: "p1", provenance: { source: { name: "test" } } }, { id: "p2", provenance: { source: { name: "test" } } }] as any });
    const req = createRequest({ productIds: ["p1", "p2"] });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("12. Tie", async () => {
    setupMocks({ mockDecision: { strongestMatch: { product: { id: "p1" } }, hasTie: true, whyMatches: [], cautions: [], generalCautions: [] } as any });
    const req = createRequest({ productIds: ["p1", "p2"] });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("15. Deterministic strongest match remains authoritative", async () => {
    // The test proves that the AI does not return or change the strongest match.
    // The payload returned to the client ONLY contains the explanation.
    // The client uses its deterministic result for rendering the UI.
    setupMocks({});
    const req = createRequest({ productIds: ["p1"] });
    const res = await POST(req);
    const data = await res.json();
    expect(data.strongestMatch).toBeUndefined();
  });
});
