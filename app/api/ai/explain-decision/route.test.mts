/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("server-only", () => ({}));

import { POST } from "./route";

// Mock the dependencies
vi.mock("../../../../lib/ai/client", () => {
  return {
    geminiClient: {
      models: {
        generateContent: vi.fn(),
      },
    },
    groqClient: {
      chat: {
        completions: {
          create: vi.fn(),
        },
      },
    },
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

import { geminiClient, groqClient } from "../../../../lib/ai/client";
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
    geminiError = false,
    groqError = false,
  }) => {
    (loadFinancialProfile as any).mockResolvedValue(mockProfile);
    (resolveCompareProducts as any).mockReturnValue(mockProducts);
    (generateDecisionGuidance as any).mockReturnValue(mockDecision);

    if (geminiError) {
      (geminiClient!.models.generateContent as any).mockRejectedValue(new Error("Gemini Provider Error"));
    } else {
      (geminiClient!.models.generateContent as any).mockResolvedValue({
        text: mockAiResponse,
      });
    }

    if (groqError) {
      (groqClient!.chat.completions.create as any).mockRejectedValue(new Error("Groq Provider Error"));
    } else {
      (groqClient!.chat.completions.create as any).mockResolvedValue({
        choices: [{ message: { content: mockAiResponse } }],
      });
    }
  };

  it("1. Gemini success", async () => {
    setupMocks({});
    const req = createRequest({ productIds: ["p1"] });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.summary).toBe("AI Summary");
    expect(geminiClient!.models.generateContent).toHaveBeenCalled();
    expect(groqClient!.chat.completions.create).not.toHaveBeenCalled();
  });

  it("2. Gemini malformed response fallback to Groq success", async () => {
    setupMocks({ mockAiResponse: "Not JSON", geminiError: false, groqError: false });
    // If Gemini returns bad JSON, it throws validation error, caught by try/catch, falls back to Groq
    // Groq will also return "Not JSON" in this mock, so Groq will fail Zod parsing too!
    // Let's modify Groq's mock locally just for this test
    (geminiClient!.models.generateContent as any).mockResolvedValue({ text: "Not JSON" });
    (groqClient!.chat.completions.create as any).mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({
        summary: "Groq Summary",
        whyItMatches: [],
        whatToConsider: [],
        questionsToAsk: [],
      }) } }],
    });

    const req = createRequest({ productIds: ["p1"] });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.summary).toBe("Groq Summary");
    expect(geminiClient!.models.generateContent).toHaveBeenCalled();
    expect(groqClient!.chat.completions.create).toHaveBeenCalled();
  });

  it("3. Gemini invalid API/model error -> Groq Fallback", async () => {
    setupMocks({ geminiError: true, groqError: false });
    const req = createRequest({ productIds: ["p1"] });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.summary).toBe("AI Summary");
  });

  it("10. Both providers unavailable", async () => {
    setupMocks({ geminiError: true, groqError: true });
    const req = createRequest({ productIds: ["p1"] });
    const res = await POST(req);
    expect(res.status).toBe(502);
    const data = await res.json();
    expect(data.error).toBe("AI explanation is temporarily unavailable.");
  });

  it("11. Zod validation failure", async () => {
    setupMocks({ mockAiResponse: JSON.stringify({ missingKeys: true }) });
    const req = createRequest({ productIds: ["p1"] });
    const res = await POST(req);
    expect(res.status).toBe(502); // Groq fallback also returns bad JSON, then 502
  });

  it("13. Deterministic decision remains authoritative", async () => {
    setupMocks({});
    const req = createRequest({ productIds: ["p1"] });
    const res = await POST(req);
    const data = await res.json();
    expect(data.strongestMatch).toBeUndefined(); // LLM must not override deterministic structure
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
  });
});
