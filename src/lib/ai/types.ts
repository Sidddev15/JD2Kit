export interface AIClient {
  provider: "groq" | "openai" | "gemini";
  model: string;
  generate(prompt: string, temperature?: number): Promise<string>;
  generateJSON(prompt: string, temperature?: number): Promise<string>;
}
