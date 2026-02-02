/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { getRequestId, ok, bad } from "@/lib/http";
import { JobJsonSchema } from "@/lib/job-json.schema";
import { JOB_TRACKS } from "@/lib/constants";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ jobRunId: string }> }
) {
  const requestId = getRequestId(req);

  try {
    const { jobRunId } = await params;
    const body = await req.json();

    const updates: any = {};

    if (body.jobJson) {
      const parsed = JobJsonSchema.parse(body.jobJson);
      updates.jobJson = parsed;
      updates.roleTitle = parsed.role_title;
      updates.companyName = parsed.company_name;
      updates.location = parsed.location;
      updates.seniorityLevel = parsed.seniority_level;
      updates.domain = parsed.domain;
      updates.tags = [
        ...(parsed.must_have_skills ?? []),
        ...(parsed.domain ? [parsed.domain] : []),
      ].slice(0, 10);
    }

    if (body.profileType) {
      const validProfileValues = JOB_TRACKS.map((t) => t.value);
      const isValidProfile = validProfileValues.includes(body.profileType);
      updates.profileType = isValidProfile ? body.profileType : undefined;
    }

    if (body.status) {
      const validStatuses = ["DRAFT", "FINAL"] as const;
      const isValidStatus = (validStatuses as readonly string[]).includes(body.status);
      updates.status = isValidStatus ? body.status : undefined;
    }

    const updated = await prisma.jobRun.update({
      where: { id: jobRunId },
      data: updates,
    });

    return ok(updated, requestId);
  } catch (err: any) {
    console.error("Failed to update JobRun", { requestId, err });
    return bad("Failed to update JobRun", requestId, 500);
  }
}
