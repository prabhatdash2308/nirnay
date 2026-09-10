import { GoogleGenerativeAI } from "@google/generative-ai";
import "server-only";

const apiKey = process.env.GEMINI_API_KEY;

export const aiClient = apiKey ? new GoogleGenerativeAI(apiKey) : null;
