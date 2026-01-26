import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { GroqClient } from "./providers/groq";
import { OpenAIClient } from "./providers/openai";
import { GeminiClient } from "./providers/gemini";
import { AIClient } from "./types";

export type AIProvider = "groq" | "openai" | "gemini";

let cached: AIClient | null = null;

export function getAIClient(providerOverride?: AIProvider): AIClient {
  const provider = providerOverride ?? env.AI_PROVIDER;

  if (!providerOverride && cached && cached.provider === provider) {
    return cached;
  }

  logger.info("AI provider selected", { provider });

  let client: AIClient;
  switch (provider) {
    case "groq":
      client = new GroqClient();
      break;
    case "openai":
      client = new OpenAIClient();
      break;
    case "gemini":
      client = new GeminiClient();
      break;
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }

  if (!providerOverride) {
    cached = client;
  }

  return client;
}
