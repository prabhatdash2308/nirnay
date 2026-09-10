import type { AIProvider } from "./config";

export interface AIRequest {
  prompt: string;
  provider?: AIProvider;
}

export interface AIResponse {
  text: string;
  provider: AIProvider;
  model: string;
}
