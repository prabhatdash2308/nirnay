import "server-only";

export type AIProvider = "gemini" | "groq";

export const aiConfig = {
  geminiApiKey: process.env.GEMINI_API_KEY,
  groqApiKey: process.env.GROQ_API_KEY,
} as const;

export function requireAIKey(provider: AIProvider): string {
  const key =
    provider === "gemini"
      ? aiConfig.geminiApiKey
      : aiConfig.groqApiKey;

  if (!key) {
    throw new Error(`${provider.toUpperCase()} API key is not configured`);
  }

  return key;
}