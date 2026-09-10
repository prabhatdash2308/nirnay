import "server-only";
import { generateAI } from "../generate";
import { EXPLANATION_SYSTEM_PROMPT } from "../prompts/explanation";
import { explanationResultSchema, ExplanationResult } from "./schemas";
import { RecommendationResult, ProductData } from "../recommendation/schemas";
import type { AIProvider } from "../config";

function cleanJsonString(rawString: string): string {
  let cleaned = rawString.trim();
  if (cleaned.startsWith("\`\`\`json")) {
    cleaned = cleaned.replace(/^\`\`\`json/m, "");
  } else if (cleaned.startsWith("\`\`\`")) {
    cleaned = cleaned.replace(/^\`\`\`/m, "");
  }
  
  if (cleaned.endsWith("\`\`\`")) {
    cleaned = cleaned.replace(/\`\`\`$/, "");
  }
  
  return cleaned.trim();
}

export async function explainRecommendation(
  recommendation: RecommendationResult,
  product: ProductData,
  provider?: AIProvider
): Promise<ExplanationResult> {
  const fullPrompt = `${EXPLANATION_SYSTEM_PROMPT}

Provided Product Data:
${JSON.stringify(product, null, 2)}

Provided Deterministic Recommendation Result:
${JSON.stringify(recommendation, null, 2)}
`;

  const response = await generateAI({
    prompt: fullPrompt,
    provider: provider || "gemini",
  });

  try {
    const cleanedText = cleanJsonString(response.text);
    const parsedJson = JSON.parse(cleanedText);
    
    const validationResult = explanationResultSchema.safeParse(parsedJson);
    
    if (!validationResult.success) {
      console.error("Explanation Zod Validation Error:", validationResult.error);
      throw new Error("Explanation failed schema validation.");
    }

    return validationResult.data;
  } catch (error) {
    console.error("Failed to parse or validate explanation JSON:", error);
    // Safe fallback without crashing
    return {
      summary: "Based on the information provided, this option matches some of your requirements.",
      whyThisRanksHigher: recommendation.matchedRequirements.length > 0 ? recommendation.matchedRequirements : ["Matches general intent."],
      tradeOffs: recommendation.tradeOffs.length > 0 ? recommendation.tradeOffs : ["No specific trade-offs explicitly identified."],
      unmetRequirements: recommendation.unmetRequirements,
      missingInformation: recommendation.missingInformation,
      verificationNotes: ["Could not fully generate narrative. Please verify details manually."]
    };
  }
}
