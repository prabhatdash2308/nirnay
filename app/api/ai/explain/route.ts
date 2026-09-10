import { NextResponse } from "next/server";
import { explainRecommendation } from "@/lib/ai/explanation/explain";
import { extractedIntentSchema } from "@/lib/ai/intent/schemas";
import { recommendProducts } from "@/lib/ai/recommendation/recommend";
import { MOCK_PRODUCTS } from "@/lib/ai/recommendation/mock-data";
import { z } from "zod";

const requestSchema = z.object({
  intent: extractedIntentSchema,
  productId: z.string(),
  provider: z.enum(["gemini", "groq"]).optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Strict validation of intent and ID ONLY.
    // Client is NOT allowed to submit a score, rank, or product breakdown.
    const validationResult = requestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request payload schema provided", details: validationResult.error },
        { status: 400 }
      );
    }

    const { intent, productId, provider } = validationResult.data;
    
    // 2. SERVER-SIDE RECOMPUTATION OF AUTHORITATIVE SCORE
    // The server reruns the deterministic recommendation against authoritative data.
    const authoritativeRecommendations = await recommendProducts(intent);
    
    // 3. RETRIEVE AUTHORITATIVE SCORE AND DATA
    const recommendation = authoritativeRecommendations.find(r => r.productId === productId);
    
    if (!recommendation) {
      return NextResponse.json(
        { error: "Product not found in recommendation results or excluded by hard constraints" },
        { status: 400 }
      );
    }
    
    const productData = MOCK_PRODUCTS.find(p => p.id === productId);
    if (!productData) {
      return NextResponse.json(
        { error: "Authoritative product data not found" },
        { status: 400 }
      );
    }

    // 4. EXPLAIN USING SERVER-VERIFIED FACTS
    const explanation = await explainRecommendation(recommendation, productData, provider);
    
    // Combine the IMMUTABLE server-generated deterministic recommendation with the narrative explanation
    return NextResponse.json({ 
      success: true,
      recommendation, // Returned directly from the server calculation
      explanation 
    });
  } catch (error) {
    console.error("Explain API Error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
