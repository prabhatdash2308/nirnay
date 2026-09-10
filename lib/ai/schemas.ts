import { z } from "zod";

export const aiResponseSchema = z.object({
  text: z.string().min(1, "Response text cannot be empty"),
  provider: z.enum(["gemini", "groq"]),
  model: z.string().min(1, "Model name cannot be empty"),
});

export type ParsedAIResponse = z.infer<typeof aiResponseSchema>;
