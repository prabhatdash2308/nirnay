import { NextResponse } from "next/server";
import { recommendProducts } from "@/lib/ai/recommendation/recommend";
import { extractedIntentSchema } from "@/lib/ai/intent/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the incoming structured intent
    const validationResult = extractedIntentSchema.safeParse(body.intent);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid intent schema provided" },
        { status: 400 }
      );
    }

    const recommendations = await recommendProducts(validationResult.data);
    
    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("Recommend API Error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
