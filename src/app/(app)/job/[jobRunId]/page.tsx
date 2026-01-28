import { prisma } from "@/lib/prisma";
import { JobRunDetailClient } from "@/components/app/job-run-detail-client";

export const dynamic = "force-dynamic";

export default async function JobRunDetailPage({
  params,
}: {
  params: Promise<{ jobRunId: string }>;
}) {
  const { jobRunId } = await params;

  const jobRun = await prisma.jobRun.findUnique({
    where: { id: jobRunId },
    include: {
      prompts: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!jobRun) {
    return <div className="text-sm text-muted-foreground">Not found.</div>;
  }

  const latestPack = await prisma.interviewPack.findFirst({
    where: { jobRunId: jobRun.id, isLatest: true },
    orderBy: { version: "desc" },
  });

  const jobRunDto = {
    id: jobRun.id,
    roleTitle: jobRun.roleTitle,
    companyName: jobRun.companyName,
    profileType: jobRun.profileType,
    status: jobRun.status,
    jdText: jobRun.jdText,
    jobJson: jobRun.jobJson,
    createdAt: jobRun.createdAt.toISOString(),
    prompts: (jobRun.prompts ?? []).map((p) => ({
      type: p.type,
      content: p.content,
      createdAt: p.createdAt.toISOString(),
    })),
  };

  const latestPackDto = latestPack
    ? JSON.parse(JSON.stringify(latestPack))
    : null;

  return <JobRunDetailClient jobRun={jobRunDto} latestPack={latestPackDto} />;
}
