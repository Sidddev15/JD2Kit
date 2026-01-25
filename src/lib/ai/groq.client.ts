import Groq from "groq-sdk";
import { AIClient } from "./types";
import { env } from "@/lib/env";

export class GroqClient implements AIClient {
  private client: Groq;

  constructor() {
    if (!env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY missing");
    }

    this.client = new Groq({
      apiKey: env.GROQ_API_KEY,
    });
  }

  async generateJSON(prompt: string): Promise<string> {
    const res = await this.client.chat.completions.create({
      model: "openai/gpt-oss-120b",
      temperature: 0,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return res.choices[0]?.message?.content ?? "";
  }
}
