import OpenAI from "openai";
import { AIClient } from "./types";
import { env } from "@/lib/env";

export class OpenAIClient implements AIClient {
  private client;

  constructor() {
    if (!env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY missing");
    }

    this.client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }

  async generateJSON(prompt: string): Promise<string> {
    const res = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    });

    return res.choices[0]?.message?.content ?? "";
  }
}
