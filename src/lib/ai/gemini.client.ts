import { AIClient } from "./types";
import { env } from "@/lib/env";

export class GeminiClient implements AIClient {
  private endpoint: string;

  constructor() {
    if (!env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY missing");
    }

    this.endpoint =
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent";
  }

  async generateJSON(prompt: string): Promise<string> {
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
          temperature: 0,
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
}
