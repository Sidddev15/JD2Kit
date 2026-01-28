/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { getRequestId, ok, bad } from "@/lib/http";
import { JobJsonSchema } from "@/lib/job-json.schema";
import { ProfileType, JobStatus } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: { jobRunId: string } }
) {
  const requestId = getRequestId(req);

  try {
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
      updates.profileType = ProfileType[body.profileType as ProfileType]
        ? body.profileType
        : undefined;
    }

    if (body.status) {
      updates.status = JobStatus[body.status as JobStatus] ? body.status : undefined;
    }

    const updated = await prisma.jobRun.update({
      where: { id: params.jobRunId },
      data: updates,
    });

    return ok(updated, requestId);
  } catch (err: any) {
    console.error("Failed to update JobRun", { requestId, err });
    return bad("Failed to update JobRun", requestId, 500);
  }
}
