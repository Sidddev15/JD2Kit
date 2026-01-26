import { prisma } from "@/lib/prisma";
import { getRequestId, ok, bad } from "@/lib/http";
import { generateJobJson } from "@/lib/services/job-run.from-jd.service";
import { ProfileType } from "@prisma/client";

export async function POST(req: Request) {
  const requestId = getRequestId(req);

  try {
    const body = await req.json();
    const { jdText, profileType } = body as {
      jdText?: string;
      profileType?: ProfileType;
    };

    if (!jdText || jdText.length < 50) {
      return bad("JD text too short", requestId);
    }

    const jobJson = await generateJobJson(jdText);

    const jobRun = await prisma.jobRun.create({
      data: {
        jdText,
        jobJson,
        profileType: profileType ?? "FULLSTACK",
        roleTitle: jobJson.role_title,
        companyName: jobJson.company_name,
        location: jobJson.location,
        seniorityLevel: jobJson.seniority_level,
        domain: jobJson.domain,
        tags: [
          ...(jobJson.must_have_skills ?? []),
          ...(jobJson.domain ? [jobJson.domain] : []),
        ].slice(0, 10),
      },
    });

    return ok(jobRun, requestId);
  } catch (err) {
    console.error("Failed to create JobRun", { requestId, err });
    return bad("Failed to create JobRun", requestId, 500);
  }
}
