import { NextResponse } from "next/server";
import { extractIntent } from "@/lib/ai/intent/extract-intent";
import type { AIProvider } from "@/lib/ai/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, provider } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return NextResponse.json(
        { error: "Prompt is required and must be a non-empty string" },
        { status: 400 }
      );
    }
    
    if (provider && provider !== "gemini" && provider !== "groq") {
      return NextResponse.json(
        { error: "Provider must be either 'gemini' or 'groq'" },
        { status: 400 }
      );
    }

    const intentData = await extractIntent(
      prompt,
      provider as AIProvider | undefined
    );

    return NextResponse.json(intentData);
  } catch (error) {
    console.error("Intent API Error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
