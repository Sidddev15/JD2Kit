/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormSchema = z.object({
  profileType: z.enum(["FRONTEND", "BACKEND", "FULLSTACK"]),
  jdText: z.string().min(50, "Paste a fuller JD (min 50 chars)."),
});

type FormValues = z.infer<typeof FormSchema>;

export default function NewJobRunPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { profileType: "FRONTEND", jdText: "" },
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const res = await fetch("/api/job-runs/from-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const json = await res.json();
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error ?? "Failed to create JobRun");
      }

      router.push(`/app/job/${json.data.id}`);
    } catch (e: any) {
      alert(e?.message ?? "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">New Job Run</h1>
        <p className="text-sm text-muted-foreground">
          Paste JD → generate job.json draft.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 md:grid-cols-3">
            <div className="md:col-span-1">
              <label className="text-sm font-medium">Profile</label>
              <Select
                value={form.watch("profileType")}
                onValueChange={(v) => form.setValue("profileType", v as any)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select profile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FRONTEND">Frontend</SelectItem>
                  <SelectItem value="BACKEND">Backend</SelectItem>
                  <SelectItem value="FULLSTACK">Fullstack</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Paste JD</label>
            <Textarea
              className="mt-1 min-h-[220px]"
              value={form.watch("jdText")}
              onChange={(e) => form.setValue("jdText", e.target.value)}
              placeholder="Paste the full job description here…"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Tip: include responsibilities + skills.
            </p>
          </div>

          <Button disabled={loading} onClick={form.handleSubmit(onSubmit)}>
            {loading ? "Generating job.json…" : "Generate job.json"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
