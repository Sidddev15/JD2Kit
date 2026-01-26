import Groq from "groq-sdk";
import { env } from "@/lib/env";
import { AIClient } from "../types";

const DEFAULT_MODEL = "llama-3.1-70b-versatile";

export class GroqClient implements AIClient {
  provider = "groq" as const;
  model = env.AI_MODEL || DEFAULT_MODEL;
  private client: Groq;

  constructor() {
    if (!env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY missing");
    }

    this.client = new Groq({ apiKey: env.GROQ_API_KEY });
  }

  async generate(prompt: string, temperature = 0) {
    const res = await this.client.chat.completions.create({
      model: this.model,
      temperature,
      messages: [
        { role: "system", content: "Return ONLY valid JSON." },
        { role: "user", content: prompt },
      ],
    });

    return res.choices[0]?.message?.content ?? "";
  }

  async generateJSON(prompt: string, temperature = 0) {
    return this.generate(prompt, temperature);
  }
}
