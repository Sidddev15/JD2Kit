/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { JOB_TRACKS } from "@/lib/constants";

import { SectionHeader } from "@/components/app/section-header";
import { JobRunActions } from "@/components/app/job-run-actions";
import { JDViewer } from "@/components/app/jd-viewer";
import { JobJsonSummary } from "@/components/app/job-json-summary";
import { PromptCards } from "@/components/app/prompt-cards";
import { InterviewPackRenderer } from "@/components/app/interview-pack-renderer";

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

  const jobTrack = jobRun.profileType as (typeof JOB_TRACKS)[number]["value"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">
            {jobRun.roleTitle}
            {jobRun.companyName ? <span className="text-muted-foreground"> · {jobRun.companyName}</span> : null}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {JOB_TRACKS.find((t) => t.value === jobTrack)?.label ?? jobRun.profileType}
            </Badge>
            <Badge variant="outline">{jobRun.status}</Badge>
            {jobRun.location ? <Badge>{jobRun.location}</Badge> : null}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Created {new Date(jobRun.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Global actions */}
      <JobRunActions
        jobRunId={jobRun.id}
        profileType={jobTrack}
        status={jobRun.status}
        jobJson={jobRun.jobJson}
        roleTitle={jobRun.roleTitle}
        companyName={jobRun.companyName}
      />

      {/* Step 1 */}
      <div className="space-y-3">
        <SectionHeader
          step="STEP 1"
          title="Understand the job"
          subtitle="Sanity-check the structured job.json before generating prompts."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <JDViewer jdText={jobRun.jdText} />
          <JobJsonSummary jobRunId={jobRun.id} jobJson={jobRun.jobJson} profileType={jobTrack} />
        </div>
      </div>

      {/* Step 2 */}
      <div className="space-y-3">
        <SectionHeader
          step="STEP 2"
          title="Generate application prompts"
          subtitle="Copy-paste into your LLM to produce resume bullets, rewrite, and cover letter."
        />
        <PromptCards
          jobRunId={jobRun.id}
          prompts={(jobRun.prompts ?? []).map((p: { type: string; content: string; createdAt: Date }) => ({
            type: p.type,
            content: p.content,
            createdAt: p.createdAt.toISOString(),
          }))}
        />
      </div>

      {/* Step 3 */}
      <div className="space-y-3">
        <SectionHeader
          step="STEP 3"
          title="Interview preparation"
          subtitle="Topics, questions, coding tasks, and system design—rendered for humans."
        />
        <InterviewPackRenderer
          version={latestPack?.version ?? null}
          pack={latestPack ? (latestPack as any) : null}
        />
      </div>
    </div>
  );
}
