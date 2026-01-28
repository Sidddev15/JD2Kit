/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobJsonEditor } from "@/components/app/job-json-editor";
import { PromptsViewer } from "@/components/app/prompts-viewer";
import { InterviewPackViewer } from "@/components/app/interview-pack-viewer";

export const dynamic = "force-dynamic";

async function saveJobJson(jobRunId: string, nextJson: any) {
  "use server";

  // We call API in Commit 6; for now this is placeholder.
  // You can also directly prisma.update here, but then you need server actions security.
}

export default async function JobRunDetailPage({
  params,
}: {
  params: { jobRunId: string };
}) {
  const jobRun = await prisma.jobRun.findUnique({
    where: { id: params.jobRunId },
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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{jobRun.roleTitle}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{jobRun.profileType}</Badge>
            <Badge variant="outline">{jobRun.status}</Badge>
            {jobRun.companyName ? <Badge>{jobRun.companyName}</Badge> : null}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {new Date(jobRun.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <form
            action={async () => {
              "use server";
              // this will be replaced by API in Commit 6 (safe + consistent)
            }}
          >
            <Button variant="outline" size="sm" type="button">
              Save Draft/Final (Commit 6)
            </Button>
          </form>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">JD Text</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="max-h-[420px] overflow-auto rounded-md border bg-muted/40 p-3 text-xs leading-relaxed">
              {jobRun.jdText}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">job.json</CardTitle>
          </CardHeader>
          <CardContent>
            <JobJsonEditor
              initial={jobRun.jobJson}
              onSave={async (nextJson) => {
                const res = await fetch(`/api/job-runs/${jobRun.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ jobJson: nextJson }),
                });
                const json = await res.json();
                if (!res.ok || !json?.ok) throw new Error(json?.error ?? "Failed");
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <form
          action={async () => {
            "use server";
          }}
        >
          <Button
            size="sm"
            onClick={async () => {
              const res = await fetch(
                `/api/job-runs/${jobRun.id}/generate-prompts`,
                { method: "POST" },
              );
              if (!res.ok) alert("Failed to generate prompts");
              else location.reload();
            }}
          >
            Generate Prompts
          </Button>
        </form>

        <Button
          size="sm"
          variant="outline"
          onClick={async () => {
            const res = await fetch(
              `/api/job-runs/${jobRun.id}/generate-interview-pack`,
              { method: "POST" },
            );
            if (!res.ok) alert("Failed to generate interview pack");
            else location.reload();
          }}
        >
          Generate Interview Pack
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PromptsViewer
          jobRunId={jobRun.id}
          prompts={(jobRun.prompts ?? []).map((p) => ({
            type: p.type,
            content: p.content,
            createdAt: p.createdAt.toISOString(),
          }))}
        />

        <InterviewPackViewer
          latestVersion={latestPack?.version ?? null}
          pack={latestPack ? { ...latestPack } : null}
        />
      </div>
    </div>
  );
}
