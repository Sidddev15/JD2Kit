import { prisma } from "@/lib/prisma";
import { getRequestId, ok, bad } from "@/lib/http";
import { generateAllPrompts } from "@/lib/prompts/prompt.service";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ jobRunId: string }> },
) {
  const requestId = getRequestId(req);

  try {
    const { jobRunId } = await params;

    const jobRun = await prisma.jobRun.findUnique({
      where: { id: jobRunId },
    });

    if (!jobRun) {
      return bad("JobRun not found", requestId, 404);
    }

    const prompts = generateAllPrompts({
      profileType: jobRun.profileType,
      jobJson: jobRun.jobJson,
    });

    await prisma.$transaction([
      prisma.promptOutput.deleteMany({ where: { jobRunId } }),
      prisma.promptOutput.createMany({
        data: prompts.map((p) => ({
          jobRunId,
          type: p.type,
          content: p.content,
        })),
      }),
    ]);

    return ok({ prompts }, requestId);
  } catch (err) {
    console.error("Failed to generate prompts", { requestId, err });
    return bad("Failed to generate prompts", requestId, 500);
  }
}
