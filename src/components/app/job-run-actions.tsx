/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DownloadJsonButton } from "@/components/app/download-buttons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type ProfileType = "FRONTEND" | "BACKEND" | "FULLSTACK";
type JobStatus = "DRAFT" | "FINAL";

const PROFILE_OPTIONS: Array<{ value: ProfileType; label: string }> = [
  { value: "FRONTEND", label: "Frontend Engineer" },
  { value: "BACKEND", label: "Backend Engineer" },
  { value: "FULLSTACK", label: "Full-Stack Engineer" },
];

const isProfileType = (v: string): v is ProfileType =>
  PROFILE_OPTIONS.some((t) => t.value === v);

export function JobRunActions(props: {
  jobRunId: string;
  profileType: ProfileType;
  status: JobStatus;
  jobJson: unknown;

  // Useful for UI display
  roleTitle?: string | null;
  companyName?: string | null;
}) {
  const router = useRouter();

  const [profileType, setProfileType] = useState<ProfileType>(props.profileType);
  const [status, setStatus] = useState<JobStatus>(props.status);
  const [busy, setBusy] = useState<null | "prompts" | "pack" | "save">(null);

  const title = useMemo(() => {
    const base = props.roleTitle ?? "jobrun";
    const company = props.companyName ? `-${props.companyName}` : "";
    return (base + company)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }, [props.roleTitle, props.companyName]);

  async function patchJobRun(next: Partial<{ profileType: ProfileType; status: JobStatus }>) {
    setBusy("save");
    try {
      const res = await fetch(`/api/job-runs/${props.jobRunId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) throw new Error(json?.error ?? "Update failed");

      toast.success("Saved");
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to save");
    } finally {
      setBusy(null);
    }
  }

  async function generatePrompts() {
    setBusy("prompts");
    try {
      const res = await fetch(`/api/job-runs/${props.jobRunId}/generate-prompts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error ?? "Prompt generation failed");

      toast.success("Prompts generated");
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to generate prompts");
    } finally {
      setBusy(null);
    }
  }

  async function generateInterviewPack() {
    setBusy("pack");
    try {
      const res = await fetch(`/api/job-runs/${props.jobRunId}/generate-interview-pack`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error ?? "Interview pack failed");

      toast.success("Interview pack generated");
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to generate interview pack");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">
          {PROFILE_OPTIONS.find((t) => t.value === profileType)?.label ?? profileType}
        </Badge>
        <Badge variant="outline">{status}</Badge>

        <div className="w-[260px] shrink-0">
          <Select
            value={profileType}
            onValueChange={(v) => {
              if (!isProfileType(v)) return;
              setProfileType(v);
              patchJobRun({ profileType: v });
            }}
            disabled={busy !== null}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Job Track" />
            </SelectTrigger>

            <SelectContent className="max-h-[320px]">
              {PROFILE_OPTIONS.map((track) => (
                <SelectItem key={track.value} value={track.value}>
                  {track.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-[140px]">
          <Select
            value={status}
            onValueChange={(v) => {
              const next = v as JobStatus;
              setStatus(next);
              patchJobRun({ status: next });
            }}
            disabled={busy !== null}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="FINAL">Final</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <DownloadJsonButton filename={`${title}-job.json`} data={props.jobJson} />

        <Button size="sm" onClick={generatePrompts} disabled={busy !== null}>
          {busy === "prompts" ? "Generating…" : "Generate Prompts"}
        </Button>

        <Button size="sm" variant="outline" onClick={generateInterviewPack} disabled={busy !== null}>
          {busy === "pack" ? "Generating…" : "Generate Interview Pack"}
        </Button>
      </div>
    </div>
  );
}
