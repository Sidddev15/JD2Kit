import { env } from "@/lib/env";
import { AIClient } from "./types";
import { GroqClient } from "./groq.client";
import { GeminiClient } from "./gemini.client";

let client: AIClient | null = null;

export function getAIClient(): AIClient {
  if (client) return client;

  switch (env.AI_PROVIDER) {
    case "groq":
      client = new GroqClient();
      break;

    case "gemini":
      client = new GeminiClient();
      break;

    default:
      throw new Error(`Unsupported AI_PROVIDER: ${env.AI_PROVIDER}`);
  }

  console.log("AI PROVIDER IN USE:", env.AI_PROVIDER);
  return client;
}
