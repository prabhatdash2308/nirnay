import "server-only";
import Groq from "groq-sdk";
import { requireAIKey } from "../config";

const GROQ_MODEL = "openai/gpt-oss-20b";

export async function generateWithGroq(prompt: string): Promise<{ text: string; model: string }> {
  const apiKey = requireAIKey("groq");
  const groq = new Groq({ apiKey });

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: GROQ_MODEL,
  });

  const text = completion.choices[0]?.message?.content;
  
  if (!text) {
    throw new Error("Groq returned an empty response");
  }

  return { text, model: GROQ_MODEL };
}
