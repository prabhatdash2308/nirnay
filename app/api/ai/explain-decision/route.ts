import { NextRequest, NextResponse } from "next/server";
import { aiClient } from "../../../../lib/ai/client";
import { EXPLAIN_DECISION_SYSTEM_PROMPT } from "../../../../lib/ai/prompts";
import { explanationResponseSchema, ExplanationResponseValidator } from "../../../../lib/ai/schemas";
import { resolveCompareProducts } from "../../../../lib/compare/utils";
import { loadFinancialProfile } from "../../../../app/(app)/settings/financial-profile/actions";
import { generateDecisionGuidance } from "../../../../lib/decide/logic";

export async function POST(req: NextRequest) {
  try {
    if (!aiClient) {
      return NextResponse.json(
        { error: "AI explanation is temporarily unavailable (Configuration missing)." },
        { status: 503 }
      );
    }

    // 1. Authenticate & load profile
    const authHeader = req.headers.get("authorization");
    let profile = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split("Bearer ")[1];
      try {
        profile = await loadFinancialProfile(token);
      } catch (err) {
        // Not a fatal error, proceed without profile
        console.warn("[AI Explain] Failed to load profile:", err);
      }
    }

    // 2. Parse body
    const body = await req.json();
    if (!body || !Array.isArray(body.productIds) || body.productIds.length === 0) {
      return NextResponse.json({ error: "Invalid product IDs" }, { status: 400 });
    }

    // 3. Resolve authoritative products
    const products = resolveCompareProducts(body.productIds);
    if (products.length === 0) {
      return NextResponse.json({ error: "No valid products provided" }, { status: 400 });
    }

    // 4. Compute authoritative decision guidance
    const decision = generateDecisionGuidance(products, profile);

    // 5. Construct secure context
    const aiContext = {
      profileContext: profile
        ? {
            incomeRange: profile.monthly_income,
            investmentBudget: profile.monthly_investment_budget,
            insuranceBudget: profile.annual_insurance_budget,
            experience: profile.financial_experience,
            riskProfile: profile.risk_profile,
            goals: profile.primary_goals,
          }
        : "No financial profile available. Explain based purely on product facts.",
      selectedProducts: products.map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        subcategory: p.subcategory,
        facts: p.keyFeatures,
        costs: p.cost,
        considerations: p.importantConsiderations,
        provenance: { source: p.provenance.source.name, status: p.provenance.status },
      })),
      deterministicResult: {
        strongestMatchId: decision.strongestMatch?.product.id ?? null,
        hasTie: decision.hasTie,
        whyMatches: decision.strongestMatch?.whyMatches ?? [],
        cautions: decision.strongestMatch?.cautions ?? [],
        generalCautions: decision.generalCautions,
      },
    };

    // 6. Call Gemini
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-pro";
    const model = aiClient.getGenerativeModel({
      model: modelName,
      systemInstruction: EXPLAIN_DECISION_SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: explanationResponseSchema,
        temperature: 0.1, // Keep it grounded
      },
    });

    const prompt = `Explain the following decision context:\n\n${JSON.stringify(aiContext, null, 2)}`;
    
    let text = "";
    try {
      const result = await model.generateContent(prompt);
      text = result.response.text();
    } catch (apiError) {
      const err = apiError as Error & { status?: number };
      console.error("[AI Explain] Gemini API Error:", {
        message: err?.message || "Unknown API error",
        status: err?.status,
        model: modelName,
      });
      return NextResponse.json(
        { error: "AI explanation is temporarily unavailable." },
        { status: 502 }
      );
    }
    
    // Strip markdown JSON block if present (sometimes model ignores responseMimeType)
    if (text.startsWith("```json")) {
      text = text.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    }
    
    let rawJson;
    try {
      rawJson = JSON.parse(text);
    } catch (parseError) {
      console.error("[AI Explain] JSON Parse Error:", { textPreview: text.substring(0, 100), error: (parseError as Error).message });
      return NextResponse.json(
        { error: "AI explanation is temporarily unavailable." },
        { status: 500 }
      );
    }
    
    // Validate the structured response
    const validation = ExplanationResponseValidator.safeParse(rawJson);
    if (!validation.success) {
      console.error("[AI Explain] Schema Validation Error:", validation.error.format());
      return NextResponse.json(
        { error: "AI explanation is temporarily unavailable." },
        { status: 500 }
      );
    }
    
    return NextResponse.json(validation.data);

  } catch (error) {
    const err = error as Error;
    console.error("[AI Explain] Unhandled Error:", {
      message: err?.message || "Unknown error",
      name: err?.name,
    });
    return NextResponse.json(
      { error: "AI explanation is temporarily unavailable." },
      { status: 500 }
    );
  }
}
