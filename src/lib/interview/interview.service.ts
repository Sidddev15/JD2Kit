/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { generateJSON } from "@/lib/ai/ai";
import { InterviewPackSchema } from "./interview.schemas";
import { buildInterviewPackPrompt } from "@/lib/prompts/prompt-templates";

export async function generateInterviewPack(args: {
  jobRunId: string;
  profileType: any;
  jobJson: any;
  candidateProfile?: any;
  requestId: string;
  providerOverride?: "groq" | "openai" | "gemini";
}) {
  const latest = await prisma.interviewPack.findFirst({
    where: { jobRunId: args.jobRunId, isLatest: true },
  });

  if (latest) {
    await prisma.interviewPack.update({
      where: { id: latest.id },
      data: { isLatest: false },
    });
  }

  const version = (latest?.version ?? 0) + 1;

  const prompt = buildInterviewPackPrompt(
    args.profileType,
    args.jobJson,
    args.candidateProfile,
  );

  const pack = await generateJSON({
    prompt,
    schema: InterviewPackSchema,
    requestId: args.requestId,
    providerOverride: args.providerOverride,
  });

  return prisma.interviewPack.create({
    data: {
      jobRunId: args.jobRunId,
      version,
      isLatest: true,
      ...pack,
    },
  });
}
