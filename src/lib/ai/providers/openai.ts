import OpenAI from "openai";
import { AIClient } from "@/lib/ai/types";
import { env } from "@/lib/env";

export class OpenAIClient implements AIClient {
  provider = "openai" as const;
  model = "gpt-4o-mini";
  private client;

  constructor() {
    if (!env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY missing");
    }

    this.client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }

  async generate(prompt: string, temperature = 0): Promise<string> {
    const res = await this.client.chat.completions.create({
      model: this.model,
      temperature,
      messages: [{ role: "user", content: prompt }],
    });

    return res.choices[0]?.message?.content ?? "";
  }

  async generateJSON(prompt: string, temperature = 0): Promise<string> {
    return this.generate(prompt, temperature);
  }
}
