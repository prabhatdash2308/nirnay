import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";
import "server-only";

const geminiApiKey = process.env.GEMINI_API_KEY;
const groqApiKey = process.env.GROQ_API_KEY;

export const geminiClient = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;
export const groqClient = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;
