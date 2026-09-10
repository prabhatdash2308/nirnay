import "server-only";
import { generateAI } from "../generate";
import { INTENT_EXTRACTION_SYSTEM_PROMPT } from "../prompts/intent";
import { extractedIntentSchema, ExtractedIntent } from "./schemas";
import type { AIProvider } from "../config";

function cleanJsonString(rawString: string): string {
  // Remove markdown code blocks if the LLM adds them despite instructions
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

export async function extractIntent(
  userMessage: string,
  provider?: AIProvider
): Promise<ExtractedIntent> {
  const fullPrompt = `${INTENT_EXTRACTION_SYSTEM_PROMPT}

User Message:
"""
${userMessage}
"""`;

  const response = await generateAI({
    prompt: fullPrompt,
    provider: provider || "gemini",
  });

  try {
    const cleanedText = cleanJsonString(response.text);
    const parsedJson = JSON.parse(cleanedText);
    
    const validationResult = extractedIntentSchema.safeParse(parsedJson);
    
    if (!validationResult.success) {
      console.error("Intent Zod Validation Error:", validationResult.error);
      throw new Error("Extracted intent failed schema validation.");
    }

    return validationResult.data;
  } catch (error) {
    console.error("Failed to parse or validate intent JSON:", error);
    // Fallback to unknown intent if parsing completely fails, preventing a hard crash
    return {
      intent: "unknown",
      category: "unknown",
      financialContext: {},
      beneficiaries: [],
      requirements: [],
      missingInformation: ["user message could not be parsed"],
      confidence: 0
    };
  }
}
