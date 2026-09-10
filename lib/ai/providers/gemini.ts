import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { requireAIKey } from "../config";

const GEMINI_MODEL = "gemini-2.5-flash";

export async function generateWithGemini(prompt: string): Promise<{ text: string; model: string }> {
  const apiKey = requireAIKey("gemini");
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return { text, model: GEMINI_MODEL };
}
