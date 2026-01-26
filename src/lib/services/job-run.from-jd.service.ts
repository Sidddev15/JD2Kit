import { getAIClient } from "@/lib/ai";
import { JobJsonSchema, JobJson } from "../job-json.schema";

export async function generateJobJson(jdText: string): Promise<JobJson> {
  let lastError: unknown;
  const prompt = `
You are an expert recruiter. Extract structured JSON from the following job description.
Return ONLY valid JSON matching this TypeScript type:
{
  "company_name": string | null,
  "role_title": string,
  "experience_years": string | null, // like "3+" or "5+"
  "location": string | null,
  "seniority_level": "junior" | "mid" | "senior" | "lead" | null,
  "domain": string | null,
  "responsibilities": string[],        // at least 3 concise bullet sentences
  "must_have_skills": string[],        // at least 5 skills/technologies
  "good_to_have_skills": string[],     // optional but include if available
  "tech_stack": string[],              // at least 5 technologies/tools
  "keywords_for_ats": string[]         // at least 10 keyword tokens for ATS
}
If a field is missing in the JD, set it to null (or [] for arrays) but still meet the minimum array lengths with best-effort sensible items.
Job description:
"""${jdText}"""
`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const ai = getAIClient();
      const raw = await ai.generateJSON(prompt);
      const parsed = JSON.parse(raw);
      return JobJsonSchema.parse(parsed);
    } catch (err) {
      lastError = err;
      if (attempt === 3) throw err;
    }
  }

  throw new Error(
    `Failed to generate valid job.json after retries: ${lastError instanceof Error ? lastError.message : String(lastError)
    }`,
  );
}
