import { ProfileType } from "@prisma/client";

const pretty = (value: unknown) => JSON.stringify(value ?? {}, null, 2);

export function buildResumeRewritePrompt(
  profileType: ProfileType,
  jobJson: unknown,
  candidateProfile?: unknown,
) {
  return `
You are a ${profileType.toLowerCase()} hiring manager. Rewrite the candidate resume to best fit the job below.
Return ONLY valid JSON with this shape:
{
  "summary": string,
  "strengths": string[],
  "experience": string[]
}

Job (structured):
${pretty(jobJson)}

Candidate (if provided):
${pretty(candidateProfile)}
`;
}

export function buildResumeBulletsPrompt(
  profileType: ProfileType,
  jobJson: unknown,
  candidateProfile?: unknown,
) {
  return `
You are crafting resume bullet points for a ${profileType.toLowerCase()} candidate.
Return ONLY valid JSON:
{
  "bullets": string[]
}
Each bullet should be concise, quantified when possible, and tailored to the job.

Job (structured):
${pretty(jobJson)}

Candidate (if provided):
${pretty(candidateProfile)}
`;
}

export function buildCoverLetterPrompt(
  profileType: ProfileType,
  jobJson: unknown,
  candidateProfile?: unknown,
) {
  return `
Write a short cover letter for a ${profileType.toLowerCase()} role.
Return ONLY valid JSON:
{
  "greeting": string,
  "body": string[],
  "closing": string
}
Body should be 3-4 paragraphs tailored to the job.

Job (structured):
${pretty(jobJson)}

Candidate (if provided):
${pretty(candidateProfile)}
`;
}

export function buildInterviewPackPrompt(
  profileType: ProfileType,
  jobJson: unknown,
  candidateProfile?: unknown,
) {
  return `
Generate an interview prep pack for a ${profileType.toLowerCase()} role.
Return ONLY valid JSON:
{
  "topics": [{"title": string, "summary"?: string}],
  "questions": [{"question": string, "category"?: string}],
  "answerGuides": [{"question": string, "guide": string}],
  "followUps": string[],
  "codingTasks": [{"prompt": string, "difficulty"?: string}],
  "systemDesign": [{"prompt": string, "focus"?: string}]
}

Job (structured):
${pretty(jobJson)}

Candidate (if provided):
${pretty(candidateProfile)}
`;
}
