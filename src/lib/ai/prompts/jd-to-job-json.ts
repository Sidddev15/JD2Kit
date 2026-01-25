export const jdToJobJsonPrompt = (jd: string) => `
You are a strict JSON parser.

TASK:
Convert the following Job Description into a JSON object that matches EXACTLY this schema:

{
  company_name: string | null,
  role_title: string,
  experience_years: string | null,
  location: string | null,
  seniority_level: "junior" | "mid" | "senior" | "lead" | null,
  domain: string | null,
  responsibilities: string[],
  must_have_skills: string[],
  good_to_have_skills?: string[],
  tech_stack: string[],
  keywords_for_ats: string[]
}

RULES:
- Output ONLY valid JSON
- No explanations, no markdown
- Infer conservatively
- If unknown → null
- Deduplicate skills
- Responsibilities must be clear, action-oriented

JOB DESCRIPTION:
"""
${jd}
"""
`;