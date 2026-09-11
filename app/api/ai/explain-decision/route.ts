import { NextRequest, NextResponse } from "next/server";
import { geminiClient, groqClient } from "../../../../lib/ai/client";
import { EXPLAIN_DECISION_SYSTEM_PROMPT } from "../../../../lib/ai/prompts";
import { explanationResponseSchema, ExplanationResponseValidator } from "../../../../lib/ai/schemas";
import { resolveCompareProducts } from "../../../../lib/compare/utils";
import { loadFinancialProfile } from "../../../../app/(app)/settings/financial-profile/actions";
import { generateDecisionGuidance } from "../../../../lib/decide/logic";

async function generateExplanationWithGemini(prompt: string) {
  if (!geminiClient) throw new Error("GEMINI_API_KEY is not configured.");
  
  const modelName = process.env.GEMINI_MODEL || "gemini-3.7-flash";
  const result = await geminiClient.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      systemInstruction: EXPLAIN_DECISION_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: explanationResponseSchema,
      temperature: 0.1,
    },
  });
  
  let text = result.text || "";
  if (text.startsWith("```json")) {
    text = text.replace(/^```json\n?/, "").replace(/\n?```$/, "");
  }
  const rawJson = JSON.parse(text);
  return ExplanationResponseValidator.parse(rawJson);
}

async function generateExplanationWithGroq(prompt: string) {
  if (!groqClient) throw new Error("GROQ_API_KEY is not configured.");
  
  const modelName = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
  const response = await groqClient.chat.completions.create({
    model: modelName,
    messages: [
      { role: "system", content: EXPLAIN_DECISION_SYSTEM_PROMPT },
      { role: "user", content: prompt }
    ],
    temperature: 0.1,
    response_format: { 
      type: "json_schema", 
      json_schema: { 
        name: "explanation", 
        strict: true, 
        schema: explanationResponseSchema as Record<string, unknown>
      } 
    }
  });

  const text = response.choices[0]?.message?.content || "";
  const rawJson = JSON.parse(text);
  return ExplanationResponseValidator.parse(rawJson);
}

export async function POST(req: NextRequest) {
  try {
    if (!geminiClient && !groqClient) {
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

    const prompt = `Explain the following decision context:\n\n${JSON.stringify(aiContext, null, 2)}`;
    
    // 6. Attempt Gemini (Primary)
    try {
      const explanation = await generateExplanationWithGemini(prompt);
      return NextResponse.json(explanation);
    } catch (geminiError) {
      const err = geminiError as Error & { status?: number };
      console.warn("[AI Explain] Gemini Failed. Attempting Fallback.", {
        message: err?.message || "Unknown API error",
        status: err?.status,
        name: err?.name,
      });

      // 7. Attempt Groq (Fallback)
      try {
        const fallbackExplanation = await generateExplanationWithGroq(prompt);
        return NextResponse.json(fallbackExplanation);
      } catch (groqError) {
        const fallbackErr = groqError as Error & { status?: number };
        console.error("[AI Explain] Groq Fallback Failed.", {
          message: fallbackErr?.message || "Unknown API error",
          status: fallbackErr?.status,
          name: fallbackErr?.name,
        });

        return NextResponse.json(
          { error: "AI explanation is temporarily unavailable." },
          { status: 502 }
        );
      }
    }
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
