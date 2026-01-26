import { prisma } from "@/lib/prisma";
import { getRequestId, ok, bad } from "@/lib/http";
import { generateInterviewPack } from "@/lib/interview/interview.service";
import type { AIProvider } from "@/lib/ai";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ jobRunId: string }> },
) {
  const requestId = getRequestId(req);

  try {
    const { jobRunId } = await params;
    const body = (await req.json().catch(() => ({}))) as {
      candidateProfile?: unknown;
      providerOverride?: AIProvider;
    };

    const jobRun = await prisma.jobRun.findUnique({
      where: { id: jobRunId },
    });

    if (!jobRun) {
      return bad("JobRun not found", requestId, 404);
    }

    const pack = await generateInterviewPack({
      jobRunId,
      profileType: jobRun.profileType,
      jobJson: jobRun.jobJson,
      candidateProfile: body.candidateProfile,
      requestId,
      providerOverride: body.providerOverride,
    });

    return ok(pack, requestId);
  } catch (err) {
    console.error("Failed to generate interview pack", { requestId, err });
    return bad("Failed to generate interview pack", requestId, 500);
  }
}
