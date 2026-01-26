import { AIClient } from "@/lib/ai/types";
import { env } from "@/lib/env";

export class GeminiClient implements AIClient {
  provider = "gemini" as const;
  model = "gemini-1.5-flash";
  private endpoint: string;

  constructor() {
    if (!env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY missing");
    }

    this.endpoint =
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";
  }

  async generate(prompt: string, temperature = 0): Promise<string> {
    const res = await fetch(`${this.endpoint}?key=${env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini API error: ${err}`);
    }

    const json = await res.json();

    return json.candidates[0].content.parts[0].text;
  }

  async generateJSON(prompt: string, temperature = 0): Promise<string> {
    return this.generate(prompt, temperature);
  }
}
