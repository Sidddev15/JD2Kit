export interface AIClient {
  generateJSON(prompt: string): Promise<string>;
}
