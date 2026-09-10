import "server-only";
import { AIRequest, AIResponse } from "./types";
import { aiResponseSchema } from "./schemas";
import { generateWithGemini } from "./providers/gemini";
import { generateWithGroq } from "./providers/groq";

export async function generateAI(request: AIRequest): Promise<AIResponse> {
  if (!request.prompt || request.prompt.trim() === "") {
    throw new Error("Prompt cannot be empty");
  }

  // Default provider if none specified
  const provider = request.provider || "gemini";
  
  let result: { text: string; model: string };

  try {
    if (provider === "gemini") {
      result = await generateWithGemini(request.prompt);
    } else if (provider === "groq") {
      result = await generateWithGroq(request.prompt);
    } else {
      throw new Error(`Unsupported provider: ${provider}`);
    }
  } catch (error) {
    console.error(`Error generating with ${provider}:`, error);
    // Return a safe error message without leaking SDK or API details
    throw new Error(`Failed to generate AI response using ${provider}`);
  }

  const rawResponse = {
    text: result.text,
    provider,
    model: result.model,
  };

  const validatedResponse = aiResponseSchema.safeParse(rawResponse);

  if (!validatedResponse.success) {
    console.error("AI response validation failed:", validatedResponse.error);
    throw new Error("AI provider returned a malformed response");
  }

  return validatedResponse.data;
}
