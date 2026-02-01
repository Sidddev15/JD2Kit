/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { JobJsonSchema } from "@/lib/job-json.schema";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { JobJsonEditor } from "@/components/app/job-json-editor";
import { CopyButton } from "@/components/app/copy-button";
import { DownloadJsonButton } from "@/components/app/download-buttons";

type JobJson = any;

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

export function JobJsonSummary(props: {
  jobRunId: string;
  jobJson: JobJson;
  profileType: string;
}) {
  const [rawOpen, setRawOpen] = useState(false);

  const parsed = (() => {
    try {
      return JobJsonSchema.parse(props.jobJson) as any;
    } catch {
      return props.jobJson as any;
    }
  })();

  const tech = Array.isArray(parsed?.tech_stack) ? parsed.tech_stack : [];
  const must = Array.isArray(parsed?.must_have_skills) ? parsed.must_have_skills : [];
  const good = Array.isArray(parsed?.good_to_have_skills) ? parsed.good_to_have_skills : [];
  const resp = Array.isArray(parsed?.responsibilities) ? parsed.responsibilities : [];
  const ats = Array.isArray(parsed?.keywords_for_ats) ? parsed.keywords_for_ats : [];

  async function saveJobJson(nextJson: any) {
    const res = await fetch(`/api/job-runs/${props.jobRunId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobJson: nextJson }),
    });
    const json = await res.json();
    if (!res.ok || !json?.ok) throw new Error(json?.error ?? "Failed to save job.json");
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">Job Summary</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => setRawOpen((v) => !v)}>
              {rawOpen ? "Hide raw JSON" : "View raw JSON"}
            </Button>

            <DownloadJsonButton filename={`jobrun-${props.jobRunId}-job.json`} data={props.jobJson} />

            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">Edit job.json</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Edit job.json (validated)</DialogTitle>
                </DialogHeader>
                <JobJsonEditor
                  initial={props.jobJson}
                  onSave={async (next) => {
                    try {
                      await saveJobJson(next);
                      toast.success("job.json saved");
                      // refresh the page so server component re-reads data
                      location.reload();
                    } catch (e: any) {
                      toast.error(e?.message ?? "Failed to save");
                      throw e;
                    }
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <Field label="Role" value={parsed?.role_title} />
          <Field label="Company" value={parsed?.company_name} />
          <Field label="Location" value={parsed?.location} />
          <Field label="Seniority" value={parsed?.seniority_level} />
          <Field label="Domain" value={parsed?.domain} />
          <Field label="Experience" value={parsed?.experience_years ? String(parsed.experience_years) : null} />
        </div>

        {tech.length ? (
          <div className="space-y-2">
            <div className="text-sm font-medium">Tech stack</div>
            <div className="flex flex-wrap gap-2">
              {tech.slice(0, 18).map((t: string) => (
                <Badge key={t} variant="secondary">{t}</Badge>
              ))}
            </div>
          </div>
        ) : null}

        {(must.length || good.length) ? (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium">Must have</div>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {must.slice(0, 10).map((s: string) => <li key={s}>{s}</li>)}
              </ul>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Good to have</div>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {good.slice(0, 10).map((s: string) => <li key={s}>{s}</li>)}
              </ul>
            </div>
          </div>
        ) : null}

        {resp.length ? (
          <div className="space-y-2">
            <div className="text-sm font-medium">Responsibilities</div>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {resp.slice(0, 8).map((r: string, i: number) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        ) : null}

        {ats.length ? (
          <div className="space-y-2">
            <div className="text-sm font-medium">ATS keywords</div>
            <div className="flex flex-wrap gap-2">
              {ats.slice(0, 22).map((k: string) => (
                <Badge key={k} variant="outline">{k}</Badge>
              ))}
            </div>
          </div>
        ) : null}

        {rawOpen ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-medium">Raw job.json</div>
              <div className="flex gap-2">
                <CopyButton text={JSON.stringify(props.jobJson, null, 2)} />
              </div>
            </div>
            <pre className="max-h-[320px] overflow-auto rounded-md border bg-muted/30 p-3 text-xs leading-relaxed">
              {JSON.stringify(props.jobJson, null, 2)}
            </pre>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
