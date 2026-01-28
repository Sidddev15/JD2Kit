/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InterviewPackViewer } from "@/components/app/interview-pack-viewer";
import { JobJsonEditor } from "@/components/app/job-json-editor";
import { PromptsViewer } from "@/components/app/prompts-viewer";
import { cn } from "@/lib/utils";

type PromptDto = { type: string; content: string; createdAt: string };

export type JobRunDto = {
  id: string;
  roleTitle: string;
  companyName: string | null;
  profileType: string;
  status: string;
  jdText: string;
  jobJson: any;
  createdAt: string;
  prompts: PromptDto[];
};

export type InterviewPackDto = any | null;

export function JobRunDetailClient({
  jobRun,
  latestPack,
}: {
  jobRun: JobRunDto;
  latestPack: InterviewPackDto;
}) {
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [loadingPack, setLoadingPack] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const onSaveJobJson = useCallback(
    async (nextJson: any) => {
      const res = await fetch(`/api/job-runs/${jobRun.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobJson: nextJson }),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error ?? "Failed");
      }
      showToast("job.json saved", "success");
    },
    [jobRun.id, showToast],
  );

  const generatePrompts = useCallback(async () => {
    try {
      setLoadingPrompts(true);
      const res = await fetch(`/api/job-runs/${jobRun.id}/generate-prompts`, {
        method: "POST",
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error ?? "Failed to generate prompts");
      }
      showToast("Prompts generated", "success");
      location.reload();
    } catch (err: any) {
      showToast(err?.message ?? "Failed to generate prompts", "error");
    } finally {
      setLoadingPrompts(false);
    }
  }, [jobRun.id, showToast]);

  const generateInterviewPack = useCallback(async () => {
    try {
      setLoadingPack(true);
      const res = await fetch(`/api/job-runs/${jobRun.id}/generate-interview-pack`, {
        method: "POST",
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error ?? "Failed to generate interview pack");
      }
      showToast("Interview pack generated", "success");
      location.reload();
    } catch (err: any) {
      showToast(err?.message ?? "Failed to generate interview pack", "error");
    } finally {
      setLoadingPack(false);
    }
  }, [jobRun.id, showToast]);

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
          <Button variant="outline" size="sm" type="button" disabled>
            Save Draft/Final (Commit 6)
          </Button>
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
            <JobJsonEditor initial={jobRun.jobJson} onSave={onSaveJobJson} />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={generatePrompts}
          disabled={loadingPrompts || loadingPack}
        >
          {loadingPrompts ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating…
            </>
          ) : (
            "Generate Prompts"
          )}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={generateInterviewPack}
          disabled={loadingPack || loadingPrompts}
        >
          {loadingPack ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating…
            </>
          ) : (
            "Generate Interview Pack"
          )}
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PromptsViewer jobRunId={jobRun.id} prompts={jobRun.prompts} />

        <InterviewPackViewer
          latestVersion={(latestPack as any)?.version ?? null}
          pack={latestPack}
        />
      </div>

      {toast ? (
        <div
          className={cn(
            "fixed bottom-4 right-4 z-50 rounded-md px-4 py-3 text-sm shadow-lg ring-1 ring-black/5",
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-800 ring-emerald-500/30"
              : "bg-red-50 text-red-800 ring-red-500/30",
          )}
        >
          {toast.message}
        </div>
      ) : null}
    </div>
  );
}
