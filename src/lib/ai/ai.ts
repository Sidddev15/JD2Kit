import { z } from "zod";
import { getAIClient, AIProvider } from "./get-ai-client";
import { logger } from "@/lib/logger";

export async function generateJSON<T extends z.ZodTypeAny>(args: {
  prompt: string;
  schema: T;
  requestId: string;
  providerOverride?: AIProvider;
}) {
  const { prompt, schema, requestId, providerOverride } = args;
  const client = getAIClient(providerOverride);

  try {
    const raw = await client.generateJSON(prompt, 0);
    const parsed = JSON.parse(raw);
    return schema.parse(parsed);
  } catch (err) {
    logger.warn("AI JSON generation failed", {
      requestId,
      provider: client.provider,
      model: client.model,
      err,
    });
    throw err;
  }
}
